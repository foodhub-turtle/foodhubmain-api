
module.exports = (sequelize, DataTypes) => {
  const Item = sequelize.define(
    "item",
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
      image: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true
      },
      category_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      cuisine_id: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      item_type_id: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      price: {
        type: DataTypes.DOUBLE,
        allowNull: true
      },
      branch_id: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      created_by: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      is_popular: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      approve_status: {
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
  Item.associate = (models) => {
    Item.belongsTo(models.branch, {foreignKey: 'branch_id', as: 'restaurant'})
    Item.belongsTo(models.branch, {foreignKey: 'branch_id', targetKey:'id', as: 'item'});
    Item.belongsTo(models.item_category, {foreignKey: 'category_id', as: 'items'})
    Item.belongsTo(models.item_category, {foreignKey: 'category_id', as: 'category'})
    Item.belongsTo(models.cuisine, {foreignKey: 'cuisine_id', as: 'cuisine'})
    Item.hasOne(models.item_mapping, {foreignKey: 'item_id',as: 'item_mapping'})
    Item.belongsTo(models.user, {foreignKey: 'created_by',as: 'created_user'});
    // associations can be defined here
  };
  return Item;
};