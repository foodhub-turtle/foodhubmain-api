module.exports = (sequelize, DataTypes) => {
    const Permission = sequelize.define(
      "permission",
      {
        id: {
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
          type: DataTypes.BIGINT
        },
        name: {
          type: DataTypes.STRING,
          allowNull: true
        },
        description: {
          type: DataTypes.TEXT,
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
        tableName: 'permission'
      }
    );
    Permission.associate = (models) => {
    };
    return Permission;
  };