module.exports = (sequelize, DataTypes) => {
  const Invoice = sequelize.define(
    "invoice",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT
      },
      customer_id: {
        type: DataTypes.INTEGER
      },
      branch_id: {
        type: DataTypes.INTEGER
      },
      order_id: {
        type: DataTypes.INTEGER
      },
      payment_id: {
        type: DataTypes.INTEGER
      },
      invoice_date: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: new Date()
      },
      status: {
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
      schema: 'public',
      tableName: 'invoices'
    }
  );
  Invoice.associate = (models) => {
    // associations can be defined here
    Invoice.belongsTo(models.order, {foreignKey: 'order_id', sourceKey:'id', as: 'order'})
    Invoice.belongsTo(models.customer, {foreignKey: 'customer_id', sourceKey:'id', as: 'customer'})
    Invoice.belongsTo(models.branch, {foreignKey: 'branch_id', sourceKey:'id', as: 'branch'})
  };
  return Invoice;
};