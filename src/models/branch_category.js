module.exports = (sequelize, DataTypes) => {
  const Branch_Category = sequelize.define(
    "branch_category",
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
      category_type_id: {
        type: DataTypes.BIGINT,
        allowNull: true
      },
      branch_id: {
        type: DataTypes.BIGINT,
        allowNull: true
      },
      reject_status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
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
    {
      schema: 'public',
      tableName: 'branch_categories'
    }
  );
  Branch_Category.associate = (models) => {
    // associations can be defined here
    Branch_Category.belongsTo(models.user, {foreignKey: 'created_by',as: 'created_user'});
    Branch_Category.belongsTo(models.item_category_type, {foreignKey: 'category_type_id',as: 'category_type'});
    Branch_Category.hasMany(models.item, {foreignKey: 'category_id', sourceKey:'id', as: 'items'})

  };
  return Branch_Category;
};