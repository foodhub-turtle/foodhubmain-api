module.exports = (sequelize, DataTypes) => {
  const OrderedRestaurant = sequelize.define(
    "ordered_restaurant",
    {
      id: {
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.BIGINT
      },
      customer_id: {
        type: DataTypes.BIGINT
      },
      branch_id: {
        type: DataTypes.BIGINT
      },
      order_count: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      is_favourite: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      avg_rating: {
        type: DataTypes.DOUBLE,
        allowNull: true
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
      tableName: 'ordered_restaurants'
    }
  );
  OrderedRestaurant.associate = () => {
    // associations can be defined here
  };

  return OrderedRestaurant;
};