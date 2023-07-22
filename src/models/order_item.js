module.exports = (sequelize, DataTypes) => {
  const Order_Item = sequelize.define(
    "order_item",
    {
      id: {
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.BIGINT
      },
      order_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      item_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      price: {
        type: DataTypes.DOUBLE,
        allowNull: false
      },
      item_variant_id: {
        type: DataTypes.BIGINT,
        allowNull: true
      },
      item_variant_name: {
        type: DataTypes.STRING,
        allowNull: true
      },
      is_product_available: {
        type: DataTypes.INTEGER,
        allowNull: true
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
  Order_Item.associate = (models) => {
    // associations can be defined here
    Order_Item.belongsTo(models.order, {foreignKey: 'order_id',as: 'order_items'});
    Order_Item.belongsTo(models.item_variant, {foreignKey: 'item_variant_id',as: 'item_variant'});
    Order_Item.hasMany(models.order_item_extra, {foreignKey: 'order_item_id', sourceKey:'id', as: 'order_item_extra'})
    Order_Item.hasOne(models.item, {foreignKey: 'id', sourceKey:'item_id', as: 'item'})
  };
  return Order_Item;
};