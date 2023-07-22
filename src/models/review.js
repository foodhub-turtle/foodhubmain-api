module.exports = (sequelize, DataTypes) => {
  const Review = sequelize.define(
    "review",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT
      },
      branch_id: {
        type: DataTypes.BIGINT,
        allowNull: false
      },
      customer_id: {
        type: DataTypes.BIGINT,
        allowNull: false
      },
      order_id: {
        type: DataTypes.BIGINT,
        allowNull: false
      },
      rider_id: {
        type: DataTypes.BIGINT,
        allowNull: false
      },
      rating: {
        type: DataTypes.DOUBLE,
        allowNull: false
      },
      rider_rating: {
        type: DataTypes.DOUBLE,
        allowNull: false
      },
      review: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      is_view_approve: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      review_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: new Date()
      },
      liked_options: {
        type: DataTypes.ARRAY(DataTypes.ENUM({
          values: ['Taste', 'Portion size', 'Packaging', 'Ingredients', 'Value for money', 'Special requests', 'Menu information', 'Order was complete']
        })),
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
        tableName: 'reviews'
    }
  );
  Review.associate = (models) => {
    // associations can be defined here
  };
  return Review;
};