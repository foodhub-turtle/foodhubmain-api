module.exports = (sequelize, DataTypes) => {
  const UserLoginInformation = sequelize.define(
    "userlogininformation",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT
      },
      slno: {
        type: DataTypes.INTEGER
      },
      user_id: {
        type: DataTypes.INTEGER
      },
      username: {
        type: DataTypes.STRING
      },
      logintime: {
        type: DataTypes.DATE
      },
      updateduseractivitytime: {
        type: DataTypes.DATE
      },
      logouttime: {
        type: DataTypes.DATE
      },
      ipaddress: {
        type: DataTypes.STRING
      },
      machinename: {
        type: DataTypes.STRING
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
      tableName: 'userlogininformation'
    }
  );
  UserLoginInformation.associate = (models) => {
    // associations can be defined here
  };
  return UserLoginInformation;
};