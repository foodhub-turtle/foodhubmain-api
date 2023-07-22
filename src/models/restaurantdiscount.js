module.exports = (sequelize, DataTypes) => {
    const RestaurantDiscount = sequelize.define(
      "restaurant_discount",
      {
        id: {
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
          type: DataTypes.BIGINT
        },
        branch_id: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        discount_id: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        status: {
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
        tableName: 'restaurant_discounts'
      }
    );
    RestaurantDiscount.associate = (models) => {
      // associations can be defined here
      RestaurantDiscount.hasMany(models.restaurant_campaign, {foreignKey: 'campaign_id', as: 'campaign_aso'});
      RestaurantDiscount.belongsTo(models.discount, {foreignKey: 'discount_id', as: 'discount'});
    };
    return RestaurantDiscount;
  };