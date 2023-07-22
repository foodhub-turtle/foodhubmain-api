module.exports = (sequelize, DataTypes) => {
    const RestaurantNotification = sequelize.define(
      "restaurant_notification",
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
        notification_table_id: {
            type: DataTypes.BIGINT,
            allowNull: true
        },
        notification_table: {
            type: DataTypes.STRING,
            allowNull: true
        },
        content: {
            type: DataTypes.BIGINT,
            allowNull: true
        },
        reject_status: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0
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
        tableName: 'restaurant_notifications'
      }
    );
    RestaurantNotification.associate = (models) => {
      // associations can be defined here
      RestaurantNotification.belongsTo(models.branch, {foreignKey: 'branch_id', as: 'branch'})
  };
    return RestaurantNotification;
  };