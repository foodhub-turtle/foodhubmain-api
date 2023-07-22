module.exports = (sequelize, DataTypes) => {
  const UserRole = sequelize.define(
    "userrole",
    {
      roleId: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        allowNull: false,
      },
      userId: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        allowNull: false,
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
      tableName: 'user_roles'
    }
  );
  UserRole.associate = (models) => {
    // associations can be defined here
  };
  return UserRole;
};