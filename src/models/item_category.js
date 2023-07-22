module.exports = (sequelize, DataTypes) => {
  const Item_Category = sequelize.define(
    "item_category",
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
      slug: {
        type: DataTypes.STRING,
        allowNull: true
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true
      },
      category_type_id: {
        type: DataTypes.INTEGER,
        allowNull: true
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
  Item_Category.associate = (models) => {
    // associations can be defined here
    Item_Category.belongsTo(models.user, {foreignKey: 'created_by',as: 'created_user'});
    Item_Category.belongsTo(models.item_category_type, {foreignKey: 'category_type_id',as: 'category_type'});
    Item_Category.hasMany(models.item, {foreignKey: 'category_id', sourceKey:'id', as: 'items'})

  };
  return Item_Category;
};