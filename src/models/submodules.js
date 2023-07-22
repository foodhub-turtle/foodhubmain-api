module.exports = (sequelize, DataTypes) => {
  const SubModules = sequelize.define(
    "submodule",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT
      },
      module_id: {
        type: DataTypes.INTEGER
      },
      sub_module_name: {
        type: DataTypes.STRING
      },
      areaname: {
        type: DataTypes.STRING
      },
      nextscreencode: {
        type: DataTypes.INTEGER
      },
      setdate: {
        type: DataTypes.DATE
      },
      user_id: {
        type: DataTypes.INTEGER
      },
      iconname: {
        type: DataTypes.STRING
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
      tableName: 'submodules'
    }
  );
  SubModules.associate = (models) => {
    // associations can be defined here
  };
  return SubModules;
};