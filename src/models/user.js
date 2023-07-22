module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define(
      "user",
      {
        id: {
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
          type: DataTypes.BIGINT
        },
        firstName: {
          type: DataTypes.STRING
        },
        lastName: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        email: {
          type: DataTypes.STRING
        },
        phone: {
          type: DataTypes.STRING
        },
        email_verified_at: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        password: {
          type: DataTypes.STRING
        },
        remember_token: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        verified: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
          defaultValue: false
        },
        blocked: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
          defaultValue: false
        },
        date_of_birth: {
          type: DataTypes.DATE,
          allowNull: true
        },
        role_id: {
          type: DataTypes.BIGINT,
          allowNull: true,
        },
        isactive: {
          type: DataTypes.INTEGER,
          allowNull: true,
          defaultValue: 1
        },
        islockout: {
          type: DataTypes.INTEGER,
          allowNull: true,
          defaultValue: 1
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
        schema: 'public',
        tableName: 'users'
      }
    );
    User.associate = (models) => {
      // associations can be defined here
      User.belongsTo(models.userroles, {foreignKey: 'role_id',as: 'user_role'});
    };
    return User;
  };