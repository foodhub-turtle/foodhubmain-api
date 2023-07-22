module.exports = (sequelize, DataTypes) => {
  const Opening_Hour = sequelize.define(
    "opening_hour",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT
      },
      branch_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      days: {
        type: DataTypes.ENUM('saturday', 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday'),
        allowNull: false
      },
      fromHour: {
        type: DataTypes.STRING,
        allowNull: false
      },
      toHour: {
        type: DataTypes.STRING,
        allowNull: false
      },
      status: {
        type: DataTypes.INTEGER,
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
  Opening_Hour.associate = () => {
    // associations can be defined here
  };
  return Opening_Hour;
};