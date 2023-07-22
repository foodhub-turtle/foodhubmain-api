module.exports = (sequelize, DataTypes) => {
  const Discount = sequelize.define(
    "discount",
    {
      id: {
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.BIGINT
      },
      title: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      description: {
          type: DataTypes.TEXT,
          allowNull: true
      },
      branch_ids: {
        type: DataTypes.ARRAY(DataTypes.BIGINT),
        allowNull: true
      },
      discount_type: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      discount_amount: {
        type: DataTypes.DOUBLE,
        allowNull: true
      },
      discount_percentage: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      start_date: {
        type: DataTypes.DATE,
        allowNull: false
      },
      end_date: {
        type: DataTypes.DATE,
        allowNull: false
      },
      is_all_branch: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      is_firstOrderOnly: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      minimum_order_amount: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0.00
      },
      maximum_discount: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      is_excluding_vat: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      is_excluding_tax: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      created_by: {
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
    {
      schema: 'public',
      tableName: 'discounts'
    }
  );
  Discount.associate = (models) => {
    // associations can be defined here
    Discount.belongsTo(models.user, {foreignKey: 'created_by',as: 'created_user'})
  };
  return Discount;
};