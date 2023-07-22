module.exports = (sequelize, DataTypes) => {
    const City = sequelize.define(
      "city",
      {
        id: {
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
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
    City.associate = (models) => {
      // associations can be defined here
    };
    return City;
  };