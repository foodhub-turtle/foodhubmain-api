module.exports = (sequelize, DataTypes) => {
    const LinkUserPermission = sequelize.define(
      "link_user_permission",
      {
        user_id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            allowNull: false
        },
        permission_id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
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
      {
        schema: 'public',
        tableName: 'link_user_permission'
      }
    );
    LinkUserPermission.associate = (models) => {
        LinkUserPermission.belongsTo(models.permission, {foreignKey: 'permission_id', as: 'permission'})
        LinkUserPermission.belongsTo(models.user, {foreignKey: 'user_id',as: 'user'});
    };
    return LinkUserPermission;
  };