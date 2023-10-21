module.exports = (sequelize, DataTypes) => {
    const Area = sequelize.define(
      "area",
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
        country_id: {
          type: DataTypes.BIGINT,
          allowNull: true
        },
        state_id: {
          type: DataTypes.BIGINT,
          allowNull: true
        },
        city_id: {
          type: DataTypes.BIGINT,
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
    Area.associate = (models) => {
      // associations can be defined here
    };
    return Area;
  };