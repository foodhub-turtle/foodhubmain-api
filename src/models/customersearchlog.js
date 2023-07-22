module.exports = (sequelize, DataTypes) => {
  const CustomerSearchLog = sequelize.define(
    "customer_search_log",
    {
      id: {
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.BIGINT
      },
      search_content: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      customer_id: {
        type: DataTypes.BIGINT,
        allowNull: true
      },
      search_datetime: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: new Date()
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
      schema: 'public',
      tableName: 'customer_search_logs'
    }
  );
  CustomerSearchLog.associate = (models) => {
    // associations can be defined here
    CustomerSearchLog.belongsTo(models.customer, {foreignKey: 'customer_id',as: 'customer'})
  };
  return CustomerSearchLog;
};