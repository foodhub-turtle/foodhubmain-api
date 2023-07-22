module.exports = (sequelize, DataTypes) => {
    const RiderTakenShift = sequelize.define(
      "rider_taken_shift",
      {
        id: {
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
          type: DataTypes.BIGINT
        },
        rider_id: {
          type: DataTypes.BIGINT,
          allowNull: true
        },
        rider_shift_id: {
          type: DataTypes.BIGINT,
          allowNull: true
        },
        isSwape: {
          type: DataTypes.INTEGER,
          allowNull: true
        },
        isActive: {
          type: DataTypes.INTEGER,
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
    RiderTakenShift.associate = (models) => {
      // associations can be defined here
    };
    return RiderTakenShift;
  };