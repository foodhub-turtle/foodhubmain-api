module.exports = (sequelize, DataTypes) => {
  const Voucher = sequelize.define(
    "voucher",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT
      },
      branch_id: {
        type: DataTypes.BIGINT,
        allowNull: true
      },
      title: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      voucher_code: {
        type: DataTypes.STRING,
        allowNull: false
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      voucher_type: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      voucher_amount: {
        type: DataTypes.DOUBLE,
        allowNull: true
      },
      voucher_percentage: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      amount_up_to: {
        type: DataTypes.DOUBLE,
        allowNull: true
      },
      start_date: {
        type: DataTypes.DATE,
        allowNull: true
      },
      end_date: {
        type: DataTypes.DATE,
        allowNull: true
      },
      start_time: {
        type: DataTypes.TIME,
        allowNull: true
      },
      end_time: {
        type: DataTypes.TIME,
        allowNull: true
      },
      created_by: {
        type: DataTypes.BIGINT,
        allowNull: false
      },
      is_all_branch: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      is_forCustomer: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      customer_id: {
        type: DataTypes.BIGINT,
        allowNull: true
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
      is_showOnTop: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      status: {
        type: DataTypes.INTEGER
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
  Voucher.associate = (models) => {
    // associations can be defined here
    Voucher.belongsTo(models.branch, {foreignKey: 'branch_id', as: 'branch'})
    Voucher.belongsTo(models.user, {foreignKey: 'created_by',as: 'created_user'});
  };
  return Voucher;
};