module.exports = (sequelize, DataTypes) => {
  const SubModuleSection = sequelize.define(
    "submodulesection",
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
      sub_module_id: {
        type: DataTypes.INTEGER
      },
      section_id: {
        type: DataTypes.INTEGER
      },
      section_name: {
        type: DataTypes.STRING
      },
      icon_name: {
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
      tableName: 'submodulesections'
    }
  );
  SubModuleSection.associate = (models) => {
    // associations can be defined here
  };
  return SubModuleSection;
};