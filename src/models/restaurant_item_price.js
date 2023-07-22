module.exports = (sequelize, DataTypes) => {
  const Restaurant_Item_Price = sequelize.define(
    "restaurant_item_price",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT
      },
      branch_id: {
        type: DataTypes.BIGINT
      },
      item_id: {
        type: DataTypes.BIGINT
      },
      admin_price: {
        type: DataTypes.DOUBLE,
        allowNull: false
      },
      branch_price: {
        type: DataTypes.DOUBLE,
        allowNull: false
      },
      status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
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
      tableName: 'restaurant_item_prices'
    }
  );
  Restaurant_Item_Price.associate = (models) => {
    // associations can be defined here
  };
  return Restaurant_Item_Price;
};