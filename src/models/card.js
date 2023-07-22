module.exports = (sequelize, DataTypes) => {
  const Card = sequelize.define(
    "card",
    {
      id: {
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.BIGINT
      },
      customer_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      card_number: {
        type: DataTypes.STRING,
        allowNull: false
      },
      card_cvc: {
        type: DataTypes.STRING,
        allowNull: false
      },
      card_expiry_month: {
        type: DataTypes.STRING,
        allowNull: false
      },
      card_expiry_year: {
        type: DataTypes.STRING,
        allowNull: false
      },
      active_status: {
        type: DataTypes.INTEGER,
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
    {}
  );
  Card.associate = () => {
    // associations can be defined here
  };
  return Card;
};