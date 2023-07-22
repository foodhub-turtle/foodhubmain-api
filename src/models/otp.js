module.exports = (sequelize, DataTypes) => {
  const OTP = sequelize.define(
    "otp",
    {
      id: {
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.BIGINT
      },
      otp: {
        type: DataTypes.STRING,
        allowNull: false
      },
      user_phone_number: {
        type: DataTypes.STRING,
        allowNull: false
      },
      expiration_time: {
        type: DataTypes.DATE,
        defaultValue: new Date()
      },
      verified: {
        type: DataTypes.BOOLEAN,
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
    {
      schema: 'public',
      tableName: 'otp'
    }
  );
  OTP.associate = (models) => {
    // associations can be defined here
  };
  return OTP;
};