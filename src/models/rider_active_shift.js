module.exports = (sequelize, DataTypes) => {
    const RiderActiveShift = sequelize.define(
      "rider_active_shift",
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
        rider_taken_shift_id: {
          type: DataTypes.BIGINT,
          allowNull: true
        },
        vehicle_type: {
          type: DataTypes.ENUM('walker', 'bicycle', 'bike'),
          allowNull: false
        },
        bag_type: {
          type: DataTypes.ENUM('standard', 'large'),
          allowNull: false
        },
        temperature: {
          type: DataTypes.INTEGER,
          allowNull: true
        },
        time: {
          type: DataTypes.STRING,
          allowNull: true
        },
        isActive: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        isTimeExtend: {
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
    RiderActiveShift.associate = (models) => {
      // associations can be defined here
    };
    return RiderActiveShift;
  };