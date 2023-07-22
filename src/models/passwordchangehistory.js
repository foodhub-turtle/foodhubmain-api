module.exports = (sequelize, DataTypes) => {
  const PasswardChangeHistory = sequelize.define(
    "passwardchangehistory",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      verification_code: {
        type: DataTypes.STRING,
        allowNull: false
      },
      setdate: {
        type: DataTypes.DATE,
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
      tableName: 'passwardchangehistorys'
    }
  );
  PasswardChangeHistory.associate = (models) => {
    // associations can be defined here
  };
  return PasswardChangeHistory;
};