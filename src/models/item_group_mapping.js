module.exports = (sequelize, DataTypes) => {
  const Item_Group_Mapping = sequelize.define(
    "item_group_mapping",
    {
      id: {
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.BIGINT
      },
      item_mapping_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      item_group_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      created_by: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
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
    {}
  );
  Item_Group_Mapping.associate = (models) => {
    Item_Group_Mapping.hasMany(models.item_group, {foreignKey: 'id', sourceKey:'item_group_id', as: 'item_group'})
    // associations can be defined here
  };
  return Item_Group_Mapping;
};