module.exports = (sequelize, DataTypes) => {
  const Employee = sequelize.define(
    "employee",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT
      },
      firstName: {
        type: DataTypes.STRING
      },
      lastName: {
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
  Employee.associate = (models) => {
    // associations can be defined here
  };
  return Employee;
};