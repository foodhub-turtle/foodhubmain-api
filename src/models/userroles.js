module.exports = (sequelize, DataTypes) => {
  const UserRole = sequelize.define(
    "userroles",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT
      },
      role_name: {
        type: DataTypes.STRING
      },
      roledescription: {
        type: DataTypes.TEXT
      },
      setdate: {
        type: DataTypes.DATE
      },
      user_id: {
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
      tableName: 'userroles'
    }
  );
  UserRole.associate = (models) => {
    // associations can be defined here

    UserRole.belongsTo(models.user, {foreignKey: 'user_id',as: 'created_user'});
  };
  return UserRole;
};