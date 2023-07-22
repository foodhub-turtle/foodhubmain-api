module.exports = (sequelize, DataTypes) => {
  const Refund = sequelize.define(
    "refund",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT
      },
      customer_id: {
        type: DataTypes.INTEGER,
          allowNull: false
      },
      refund_type_id: {
        type: DataTypes.INTEGER,
          allowNull: false
      },
      refund_issue_id: {
        type: DataTypes.INTEGER,
          allowNull: false
      },
      refund_status: {
        type: DataTypes.INTEGER,
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
    {}
  );
  Refund.associate = (models) => {
    // associations can be defined here
  };
  return Refund;
};