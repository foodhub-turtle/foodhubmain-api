module.exports = (sequelize, DataTypes) => {
  const UserDetail = sequelize.define(
    "userdetail",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT
      },
      lastlogindate: {
        type: DataTypes.DATE
      },
      lastpasswordchangeddate: {
        type: DataTypes.DATE
      },
      lastlockoutdate: {
        type: DataTypes.DATE
      },
      isloggedin: {
        type: DataTypes.INTEGER
      },
      failedpasswordattemptcount: {
        type: DataTypes.INTEGER
      },
      emailaddress: {
        type: DataTypes.STRING
      },
      setdate: {
        type: DataTypes.DATE
      },
      createdbyuserid: {
        type: DataTypes.STRING
      },
      user_id: {
        type: DataTypes.INTEGER
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
      tableName: 'userdetails'
    }
  );
  UserDetail.associate = (models) => {
    // associations can be defined here
  };
  return UserDetail;
};