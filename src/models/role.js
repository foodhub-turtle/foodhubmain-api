module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define(
    "role",
    {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
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
      tableName: 'roles'
    }
  );
  Role.associate = () => {
    // associations can be defined here
  };
  return Role;
};