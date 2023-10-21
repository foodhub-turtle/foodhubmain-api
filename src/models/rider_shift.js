module.exports = (sequelize, DataTypes) => {
  const RiderShift = sequelize.define(
    "rider_shift", {
      id: {
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.BIGINT
      },
      area_id: {
        type: DataTypes.BIGINT,
        allowNull: true
      },
      rider_work_time_id: {
        type: DataTypes.BIGINT,
        allowNull: true
      },
      rider_shift_week_id: {
        type: DataTypes.BIGINT,
        allowNull: true
      },
      shiftdate: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: new Date()
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
    }, {}
  );
  RiderShift.associate = (models) => {
    // associations can be defined here
  };
  return RiderShift;
};