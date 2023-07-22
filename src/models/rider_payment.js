module.exports = (sequelize, DataTypes) => {
    const RiderPayment = sequelize.define(
      "rider_payment",
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
        payment_id: {
          type: DataTypes.BIGINT,
          allowNull: true
        },
        order_id: {
            type: DataTypes.BIGINT,
            allowNull: true
        },
        amount: {
            type: DataTypes.DOUBLE,
            allowNull: false
        },
        commission: {
            type: DataTypes.DOUBLE,
            allowNull: false
        },
        tips: {
            type: DataTypes.DOUBLE,
            allowNull: false
        },
        tax: {
            type: DataTypes.DOUBLE,
            allowNull: false
        },
        payment_date: {
            type: DataTypes.DATE,
            allowNull: false
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
    RiderPayment.associate = (models) => {
      // associations can be defined here
    };
    return RiderPayment;
  };