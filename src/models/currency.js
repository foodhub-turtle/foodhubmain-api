module.exports = (sequelize, DataTypes) => {
    const Currency = sequelize.define(
      "currency",
      {
        id: {
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
          type: DataTypes.BIGINT
        },
        title: {
          type: DataTypes.STRING,
          allowNull: true
        },
        symbol: {
          type: DataTypes.STRING,
          allowNull: true
        },
        status: {
          type: DataTypes.INTEGER,
          allowNull: true
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
    Currency.associate = (models) => {
      // associations can be defined here
    };
    return Currency;
  };