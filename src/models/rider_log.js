module.exports = (sequelize, DataTypes) => {
  const RiderLog = sequelize.define(
    "rider_log",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT
      },
      rider_id: {
        type: DataTypes.BIGINT,
        allowNull: true
      },
      available_amount: {
        type: DataTypes.DOUBLE,
        allowNull: true
      },
      map_longitude: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      map_latitude: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      vehicle_type: {
        type: DataTypes.ENUM('bicycle', 'bike'),
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
  RiderLog.associate = (models) => {
    // associations can be defined here
  };
  return RiderLog;
};