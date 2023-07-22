module.exports = (sequelize, DataTypes) => {
  const Ingredient_Mapping = sequelize.define(
    "ingredient_mapping",
    {
      id: {
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.BIGINT
      },
      item_group_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      ingredient_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      ingredient_price: {
        type: DataTypes.DOUBLE,
        allowNull: false
      },
      ingredient_price_before_discount: {
        type: DataTypes.DOUBLE,
        allowNull: false
      },
      is_available: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
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
  Ingredient_Mapping.associate = (models) => {
    // associations can be defined here
    Ingredient_Mapping.belongsTo(models.item_group, {foreignKey: 'item_group_id', targetKey: 'id',as: 'a'});
    Ingredient_Mapping.hasMany(models.ingredient, {foreignKey: 'id', sourceKey:'ingredient_id', as: 'b'});

  };
  return Ingredient_Mapping;
};