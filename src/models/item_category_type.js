
module.exports = (sequelize, DataTypes) => {
  const Item_Category_Type = sequelize.define(
    "item_category_type",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT
      },
      name: {
        type: DataTypes.STRING,
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
      schema: 'public',
      tableName: 'item_category_types'
    }
  );
  Item_Category_Type.associate = (models) => {
    // associations can be defined here
  };
  return Item_Category_Type;
};