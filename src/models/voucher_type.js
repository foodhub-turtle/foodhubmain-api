module.exports = (sequelize, DataTypes) => {
  const VoucherType = sequelize.define(
    "voucher_type",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      name: {
        type: DataTypes.STRING
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
  VoucherType.associate = (models) => {
    // associations can be defined here
  };
  return VoucherType;
};