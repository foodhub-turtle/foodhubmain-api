module.exports = (sequelize, DataTypes) => {
  const Item_Group = sequelize.define(
    "item_group",
    {
      id: {
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.BIGINT
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      ingredient_type: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
      },
      minimum_ingredients: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      maximum_ingredients: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      created_by: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      sort_no: {
        type: DataTypes.INTEGER,
        allowNull: true
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
  Item_Group.associate = (models) => {
    // associations can be defined here
    // Item_Group.belongsTo(models.item_group_mapping, {sourceKey: 'id', targetKey:'item_group_id', as: 'item_group_mapping'});
    Item_Group.hasMany(models.ingredient_mapping, {foreignKey: 'item_group_id', as: 'ingredients'});
    Item_Group.belongsTo(models.user, {foreignKey: 'created_by',as: 'created_user'});
  };
  return Item_Group;
};