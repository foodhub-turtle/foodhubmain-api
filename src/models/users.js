module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "users",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT
      },
      access_level: {
        type: DataTypes.STRING,
        allowNull: false
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false
      },
      userfullname: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      registration_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      registration_type: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      password: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      role_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      isactive: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      changepassword: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      islockedout: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      setdate: {
        type: DataTypes.DATE,
        allowNull: false
      },
      createdby: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: new Date()
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: new Date()
      }
    },
    {
      schema: 'security',
      tableName: 'users'
    }
  );
  User.associate = (models) => {
    // associations can be defined here
  };
  return User;
};