module.exports = (sequelize, DataTypes) => {
    const Batch = sequelize.define(
      "batch",
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
        description: {
          type: DataTypes.TEXT,
          allowNull: true
        },
        conditions: {
          type: DataTypes.JSON,
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
    Batch.associate = (models) => {
      // associations can be defined here
    };
    return Batch;
  };