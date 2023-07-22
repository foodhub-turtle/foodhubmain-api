module.exports = (sequelize, DataTypes) => {
  const Store = sequelize.define(
    "store",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT
      },
      name: {
        type: DataTypes.STRING
      },
      email: {
        type: DataTypes.STRING
      },
      phone: {
        type: DataTypes.STRING
      },
      average_cost: {
        type: DataTypes.STRING
      },
      role: {
        type: DataTypes.INTEGER
      },
      business_category_id: {
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
  Store.associate = (models) => {
    // associations can be defined here
  };
  return Store;
};