module.exports = (sequelize, DataTypes) => {
  const UserLog = sequelize.define(
    "userlog",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT
      },
      company_id: {
        type: DataTypes.INTEGER
      },
      user_id: {
        type: DataTypes.INTEGER
      },
      login_id: {
        type: DataTypes.INTEGER
      },
      screencode: {
        type: DataTypes.INTEGER
      },
      visiteddate: {
        type: DataTypes.DATE
      },
      operation: {
        type: DataTypes.STRING
      },
      method: {
        type: DataTypes.STRING
      },
      remarks: {
        type: DataTypes.STRING
      },
      ipaddress: {
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
      tableName: 'userlog'
    }
  );
  UserLog.associate = (models) => {
    // associations can be defined here
  };
  return UserLog;
};