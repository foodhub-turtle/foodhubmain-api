module.exports = (sequelize, DataTypes) => {
  const Order_Item_Extra = sequelize.define(
    "order_item_extra",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT
      },
      order_item_id: {
        type: DataTypes.INTEGER
      },
      ingredient_id: {
        type: DataTypes.INTEGER
      },
      quantity: {
        type: DataTypes.INTEGER
      },
      price: {
        type: DataTypes.DOUBLE,
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
    {}
  );
  Order_Item_Extra.associate = (models) => {
    // associations can be defined here
    Order_Item_Extra.hasMany(models.ingredient, {foreignKey: 'id', as: 'ingredients'});
  };
  return Order_Item_Extra;
};