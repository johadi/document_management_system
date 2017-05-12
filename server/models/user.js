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
        len: {
          args: [2, 40],
          msg: 'First Name length should range between 2 - 40 characters'
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
        len: {
          args: [2, 40],
          msg: 'Last Name length should range between 2 - 40 characters'
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
        msg: 'Oops. There is an existing account with this email.'
      },
      validate: {
        isEmail: {
          args: true,
          msg: 'The email you entered is invalid.'
        },
        max: {
          args: 254,
          msg: 'The email you entered is invalid  and longer \
than 254 characters.'
        }
      },
      set(value) {
        this.setDataValue('email', value.trim().toLowerCase());
      }
    },
    roleId: {
      allowNull: false,
      defaultValue: 2,
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: {
          msg: 'Role id is required'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isPassword(value) {
          if (value.length < 6) {
            throw new Error('Your password cannot be less than 6 characters');
          }
        }
      }
    }
  }, {
    classMethods: {
      associate: (models) => {
        // associations can be defined here
        User.belongsTo(models.Role, { foreignKey: 'roleId' });
        User.hasMany(models.Document, {
          foreignKey: 'creatorId',
          onDelete: 'CASCADE',
          hooks: true
        });
      }
    },

    instanceMethods: {
      passwordMatch(password) {
        return bcrypt.compareSync(password, this.password);
      },

      hashPassword() {
        this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync());
      }
    },

    hooks: {
      beforeCreate: (user) => {
        user.hashPassword();
      },
      beforeUpdate: (user) => {
        if (user.new_password) {
          user.hashPassword();
        }
      }
    }
  });
  return User;
};
