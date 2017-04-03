import bcrypt from 'bcrypt-nodejs';

export default (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    firstname: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'First Name is required'
        },
        len: {
          args: [2, 40],
          msg: 'First Name length should range between 3 - 40 characters'
        }
      },
      set(value) {
        this.setDataValue('firstname', value.trim());
      }
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Last Name is required'
        },
        len: {
          args: [2, 40],
          msg: 'Last Name length should range between 3 - 40 characters'
        }
      },
      set(value) {
        this.setDataValue('lastname', value.trim());
      }
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: 'Oops. There is an existing account with this username.'
      },
      validate: {
        len: {
          args: [6, 40],
          msg: 'Username length should range between 6 - 40 characters'
        }
      },
      set(value) {
        this.setDataValue('username', value.trim());
      }
    },
    email: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: {
        args: true,
        msg: 'Oops. There is an existing account with this email address.'
      },
      validate: {
        isEmail: {
          args: true,
          msg: 'The email you entered is invalid.'
        },
        max: {
          args: 254,
          msg: `The email you entered is invalid  and longer 
than 254 characters.`
        }
      },
      set(value) {
        this.setDataValue('email', value.trim().toLowerCase());
      }
    },
    roleId: {
      allowNull: false,
      defaultValue: 2,
      type: DataTypes.INTEGER
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        min: {
          args: 6,
          msg: 'Your password cannot be less than 6 characters'
        }
      }
    }
  }, {
    classMethods: {
      associate: (models) => {
        // associations can be defined here
        User.belongsTo(models.Role, { foreignKey: 'roleId' });
        User.hasMany(models.Document, { foreignKey: 'createorId' });
      }
    },

    instanceMethods: {
      passwordMatch(password) {
        return bcrypt.compareSync(password, this.password);
      },

      hashPassword() {
        this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(8));
      }
    },

    hooks: {
      beforeCreate: (newUser) => {
        newUser.hashPassword();
      },
      beforeUpdate: (newUser) => {
        newUser.hashPassword();
      }
    }
  });
  return User;
};
