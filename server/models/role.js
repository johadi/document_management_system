export default (sequelize, DataTypes) => {
  const Role = sequelize.define('Role', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: 'This Role tile already exists'
      },
      validate: {
        notEmpty: {
          msg: 'Title cannot be empty'
        },
        len: {
          args: [6, 254],
          msg: 'Title length should range between 6 - 254 characters'
        }
      }
    }
  }, {
    classMethods: {
      associate(models) {
        // associations can be defined here
        Role.hasMany(models.User, {
          foreignKey: 'roleId'
        });
      }
    }
  });
  return Role;
};
