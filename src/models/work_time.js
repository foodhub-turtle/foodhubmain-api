module.exports = (sequelize, DataTypes) => {
    const WorkTime = sequelize.define(
      "work_time",
      {
        id: {
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
          type: DataTypes.BIGINT
        },
        start_time: {
          type: DataTypes.TIME,
          allowNull: true
        },
        end_time: {
          type: DataTypes.TIME,
          allowNull: true
        },
        total_time: {
          type: DataTypes.TEXT,
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
    WorkTime.associate = (models) => {
      // associations can be defined here
    };
    return WorkTime;
  };