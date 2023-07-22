module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define(
    "transaction",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT
      },
      customer_id: {
        type: DataTypes.INTEGER
      },
      order_id: {
        type: DataTypes.INTEGER
      },
      branch_id: {
        type: DataTypes.INTEGER
      },
      transaction_gateway_id: {
        type: DataTypes.INTEGER
      },
      transaction_status: {
        type: DataTypes.INTEGER
      },
      status: {
        type: DataTypes.INTEGER
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
  Transaction.associate = (models) => {
    // associations can be defined here
  };
  return Transaction;
};