module.exports = (sequelize, DataTypes) => {
    const AppReview = sequelize.define(
      "app_review",
      {
        id: {
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
          type: DataTypes.BIGINT
        },
        rating: {
          type: DataTypes.DOUBLE,
          allowNull: true
        },
        feedback: {
          type: DataTypes.TEXT,
          allowNull: true
        },
        customer_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        status: {
            type: DataTypes.INTEGER,
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
      {}
    );
    AppReview.associate = (models) => {
      // associations can be defined here
    };
    return AppReview;
  };