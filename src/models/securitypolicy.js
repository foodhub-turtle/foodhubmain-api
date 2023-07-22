module.exports = (sequelize, DataTypes) => {
  const SecurityPolicie = sequelize.define(
    "securitypolicy",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT
      },
      securitypolicyid: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      companyid: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      maximumwronglogintry: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      minimumpasswordlength: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      passwordattemptwindow: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      useronlinetimewindow: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      isalphanumericpasswordrequired: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      ispasswordsaltrequired: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      ispasswordstrengthrequired: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      isuniqueemailrequired: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      isemployeeidrequired: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      setdate: {
        type: DataTypes.DATE,
        allowNull: false
      },
      user_id: {
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
      tableName: 'securitypolicy'
    }
  );
  SecurityPolicie.associate = (models) => {
    // associations can be defined here
  };
  return SecurityPolicie;
};