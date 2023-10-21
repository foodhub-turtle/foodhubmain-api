module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define(
    "order",
    {
      id: {
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.BIGINT
      },
      order_number: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      customer_id: {
        type: DataTypes.BIGINT,
        allowNull: false
      },
      rider_id: {
        type: DataTypes.BIGINT,
        allowNull: true
      },
      customer_address_id: {
        type: DataTypes.BIGINT,
        allowNull: false
      },
      admin_id: {
        type: DataTypes.BIGINT,
        allowNull: true
      },
      note: {
        type: DataTypes.STRING,
        allowNull: true
      },
      item_count: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      sub_total: {
        type: DataTypes.DOUBLE,
        allowNull: true
      },
      discount_amount: {
        type: DataTypes.DOUBLE,
        allowNull: true
      },
      vat_amount: {
        type: DataTypes.DOUBLE,
        allowNull: true
      },
      tax_amount: {
        type: DataTypes.DOUBLE,
        allowNull: true
      },
      voucher_amount: {
        type: DataTypes.DOUBLE,
        allowNull: true
      },
      voucher_ids: {
        type: DataTypes.JSON,
        allowNull: true
      },
      delivery_amount: {
        type: DataTypes.DOUBLE,
        allowNull: true
      },
      grand_total: {
        type: DataTypes.DOUBLE,
        allowNull: false
      },
      branch_id: {
        type: DataTypes.BIGINT,
        allowNull: true
      },
      created_by: {
        type: DataTypes.BIGINT,
        allowNull: true
      },
      is_paid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
      },
      is_contactLess: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 1
      },
      is_asap: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 1
      },
      is_reviewed: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      order_status: {
        type: DataTypes.ENUM('pending', 'confirmed', 'prepared', 'preparing', 'readytopickup','acceptedorder', 'arrivedatvendor','handovertorider', 'pickeduporder', 'arrivedatcustomer','handovertocustomer','delivering', 'delivered', 'rejected'),
        allowNull: false
      },
      payment_status: {
        type: DataTypes.ENUM('pending', 'success', 'failed'),
        allowNull: false
      },
      payment_method: {
        type: DataTypes.ENUM('card', 'bkash', 'cash'),
        allowNull: false
      },
      order_type: {
        type: DataTypes.ENUM('delivery', 'pickup'),
        allowNull: false
      },
      order_datetime: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: new Date()
      },
      order_receivedtime: {
        type: DataTypes.STRING,
        allowNull: true
      },
      order_acceptedtime: {
        type: DataTypes.STRING,
        allowNull: true
      },
      order_indeliverytime: {
        type: DataTypes.STRING,
        allowNull: true
      },
      order_deliveredtime: {
        type: DataTypes.STRING,
        allowNull: true
      },
      status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: new Date()
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: new Date()
      },
    },
    {}
  );
  Order.associate = (models) => {
    // associations can be defined here
    Order.hasMany(models.order_item, {foreignKey: 'order_id', sourceKey:'id', as: 'order_items'})
    Order.belongsTo(models.customer, {foreignKey: 'customer_id', sourceKey:'id', as: 'customer'})
    Order.belongsTo(models.rider, {foreignKey: 'rider_id', sourceKey:'id', as: 'rider'})
    Order.belongsTo(models.address, {foreignKey: 'customer_address_id', sourceKey:'id', as: 'customer_address'})
    Order.belongsTo(models.branch, {foreignKey: 'branch_id', sourceKey:'id', as: 'branch'})
  };
  return Order;
};