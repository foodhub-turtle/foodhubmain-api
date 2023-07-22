module.exports = (sequelize, DataTypes) => {
  const RoleWiseScreenPermission = sequelize.define(
    "rolewisescreenpermission",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT
      },
      page: {
        type: DataTypes.STRING,
        allowNull: false
      },
      section: {
        type: DataTypes.STRING,
        allowNull: false
      },
      sub_section: {
        type: DataTypes.STRING,
        allowNull: false
      },
      data_value: {
        type: DataTypes.JSON,
        allowNull: false
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      status: {
        type: DataTypes.INTEGER,
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
      schema: 'security',
      tableName: 'rolewisescreenpermissions'
    }
  );
  RoleWiseScreenPermission.associate = (models) => {
    // associations can be defined here
  };
  return RoleWiseScreenPermission;
};