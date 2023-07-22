module.exports = (sequelize, DataTypes) => {
  const Ingredient = sequelize.define(
    "ingredient",
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
  Ingredient.associate = (models) => {
    // associations can be defined here
    Ingredient.belongsTo(models.ingredient_mapping, {foreignKey: 'id', as: 'b'});
    Ingredient.belongsTo(models.order_item_extra, {foreignKey: 'id', as: 'ingredients'});
    Ingredient.belongsTo(models.user, {foreignKey: 'created_by',as: 'created_user'});
  };
  return Ingredient;
};