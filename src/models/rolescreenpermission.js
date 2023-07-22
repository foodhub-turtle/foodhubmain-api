module.exports = (sequelize, DataTypes) => {
    const Rolescreenpermission = sequelize.define(
      "rolescreenpermission",
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: DataTypes.BIGINT
        },
        screen_code: {
          type: DataTypes.STRING
        },
        can_add: {
          type: DataTypes.INTEGER
        },
        can_edit: {
          type: DataTypes.INTEGER
        },
        can_delete: {
          type: DataTypes.INTEGER
        },
        can_view: {
          type: DataTypes.INTEGER
        },
        date: {
          type: DataTypes.DATE
        },
        role_id: {
          type: DataTypes.BIGINT
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
        tableName: 'rolescreenpermissions'
      }
    );
    Rolescreenpermission.associate = (models) => {
      // associations can be defined here
    };
    return Rolescreenpermission;
  };