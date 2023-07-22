module.exports = (sequelize, DataTypes) => {
  const Payment = sequelize.define(
    "payment",
    {
      id: {
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.BIGINT
      },
      transaction_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      order_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      currency_id: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      amount: {
        type: DataTypes.DOUBLE,
        allowNull: false
      },
      payment_method: {
        type: DataTypes.STRING,
        allowNull: false
      },
      status: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: new Date()
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: new Date()
      },
    },
    {}
  );
  Payment.associate = () => {
    // associations can be defined here
  };
  return Payment;
};