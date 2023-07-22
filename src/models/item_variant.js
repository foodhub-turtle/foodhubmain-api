module.exports = (sequelize, DataTypes) => {
  const Item_Variant = sequelize.define(
    "item_variant",
    {
      id: {
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.BIGINT
      },
      item_id: {
        type: DataTypes.BIGINT,
        allowNull: false
      },
      branch_id: {
        type: DataTypes.BIGINT,
        allowNull: false
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true
      },
      price: {
        type: DataTypes.DOUBLE,
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
      created_by: {
        type: DataTypes.INTEGER,
        allowNull: true
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
  Item_Variant.associate = (models) => {
    // associations can be defined here
    Item_Variant.belongsTo(models.user, {foreignKey: 'created_by',as: 'created_user'});

  };
  // Item_Variant.beforeCreate(user => user.id = uuidv4());
  return Item_Variant;
};