module.exports = (sequelize, DataTypes) => {
    const RiderOrderLog = sequelize.define(
      "rider_order_log",
      {
        id: {
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
          type: DataTypes.BIGINT
        },
        rider_id: {
          type: DataTypes.BIGINT,
          allowNull: true
        },
        order_id: {
          type: DataTypes.BIGINT,
          allowNull: true
        },
        customer_id: {
          type: DataTypes.BIGINT,
          allowNull: true
        },
        order_status: {
          type: DataTypes.ENUM('pending', 'confirmed', 'prepared', 'preparing', 'readytopickup', 'handovertorider', 'acceptedorder', 'handovertocustomer','delivering', 'delivered', 'rejected'),
          allowNull: true
        },
        datetime: {
          type: DataTypes.DATE,
          allowNull: true,
          defaultValue: new Date()
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
    RiderOrderLog.associate = (models) => {
      // associations can be defined here
    };
    return RiderOrderLog;
  };