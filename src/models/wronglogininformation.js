module.exports = (sequelize, DataTypes) => {
  const WrongLoginInformation = sequelize.define(
    "wronglogininformation",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT
      },
      username: {
        type: DataTypes.STRING
      },
      logintime: {
        type: DataTypes.DATE
      },
      ipaddress: {
        type: DataTypes.STRING
      },
      machinename: {
        type: DataTypes.STRING
      },
      wronglogincounter: {
        type: DataTypes.INTEGER
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
    {
      schema: 'security',
      tableName: 'wronglogininformation'
    }
  );
  WrongLoginInformation.associate = (models) => {
    // associations can be defined here
  };
  return WrongLoginInformation;
};