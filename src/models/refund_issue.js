module.exports = (sequelize, DataTypes) => {
  const RefundIssue = sequelize.define(
    "refund_issue",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT
      },
      name: {
        type: DataTypes.STRING,
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
  RefundIssue.associate = (models) => {
    // associations can be defined here
  };
  return RefundIssue;
};