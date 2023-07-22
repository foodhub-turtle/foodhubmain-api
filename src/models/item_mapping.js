module.exports = (sequelize, DataTypes) => {
  const Item_Mapping = sequelize.define(
    "item_mapping",
    {
      id: {
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.BIGINT
      },
      restaurant_id: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      branch_id: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      category_id: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      item_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      image: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true
      },
      created_by: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      is_hasVariants: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
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
    {}
  );
  Item_Mapping.associate = (models) => {
    // associations can be defined here
    Item_Mapping.hasMany(models.item_group_mapping, {foreignKey: 'item_mapping_id', as: 'item_group_mapping'});
    Item_Mapping.belongsTo(models.user, {foreignKey: 'created_by',as: 'created_user'});
    Item_Mapping.belongsTo(models.item, {foreignKey: 'item_id',as: 'item'});
    Item_Mapping.belongsTo(models.restaurant, {foreignKey: 'restaurant_id',as: 'restaurant'});
    Item_Mapping.belongsTo(models.branch, {foreignKey: 'branch_id',as: 'branch'});
    Item_Mapping.belongsTo(models.item_category, {foreignKey: 'category_id',as: 'category'});

  };
  // Item_Mapping.beforeCreate(user => user.id = uuidv4());
  return Item_Mapping;
};