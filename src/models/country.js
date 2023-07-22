module.exports = (sequelize, DataTypes) => {
    const Country = sequelize.define(
      "country",
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
    Country.associate = (models) => {
      // associations can be defined here
    };
    return Country;
  };