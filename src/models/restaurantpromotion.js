module.exports = (sequelize, DataTypes) => {
  const RestaurantPromotion = sequelize.define(
    "restaurant_promotion",
    {
      id: {
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.BIGINT
      },
      promotion_id: {
        type: DataTypes.BIGINT,
        allowNull: false
      },
      branch_id: {
        type: DataTypes.BIGINT,
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
      tableName: 'restaurant_promotions'
    }
  );
  RestaurantPromotion.associate = (models) => {
    // associations can be defined here
  };
  return RestaurantPromotion;
};