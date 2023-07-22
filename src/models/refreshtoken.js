const config = require("../config/auth");
const { v4: uuidv4 } = require("uuid");
module.exports = (sequelize, DataTypes) => {
  const RefreshToken = sequelize.define(
    "refreshtoken",
    {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      token: {
        type: DataTypes.STRING,
      },
      expiryDate: {
        type: DataTypes.DATE,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: new Date()
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: new Date()
      },
    },
    {
      // schema: 'security',
      tableName: 'refreshtokens'
    }
  );
  RefreshToken.associate = () => {
    // associations can be defined here
  };
  RefreshToken.createToken = async function (user) {
    let expiredAt = new Date();

    expiredAt.setSeconds(expiredAt.getSeconds() + config.jwtRefreshExpiration);

    let _token = uuidv4();

    let refreshToken = await this.create({
      token: _token,
      userId: user.id,
      expiryDate: expiredAt.getTime(),
    });

    return refreshToken.token;
  };
  RefreshToken.verifyExpiration = (token) => {
    return token.expiryDate.getTime() < new Date().getTime();
  };
  return RefreshToken;
};