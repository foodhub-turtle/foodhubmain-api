module.exports = (sequelize, DataTypes) => {
  const CorporateCustomer = sequelize.define(
    "corporate_customer",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT
      },
      first_name: {
        type: DataTypes.STRING
      },
      last_name: {
        type: DataTypes.STRING
      },
      image: {
        type: DataTypes.TEXT
      },
      country: {
        type: DataTypes.STRING
      },
      phone: {
        type: DataTypes.STRING
      },
      email: {
        type: DataTypes.STRING
      },
      use_id: {
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
  CorporateCustomer.associate = (models) => {
    // associations can be defined here
  };
  return CorporateCustomer;
};