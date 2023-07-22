module.exports = (sequelize, DataTypes) => {
  const Branch = sequelize.define(
    "branch",
    {
      id: {
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.BIGINT
      },
      branch_uid: {
        type: DataTypes.STRING,
        allowNull: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false
      },
      image: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      banner_image: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      parent_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false
      },
      map_longitude: {
        type: DataTypes.STRING,
        allowNull: true
      },
      map_latitude: {
        type: DataTypes.STRING,
        allowNull: true
      },
      city: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      state: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      area: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      country: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      category_id: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        allowNull: false
      },
      cuisine_id: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        allowNull: false
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      preparation_time: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      is_hasTax: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      tax_percentage: {
        type: DataTypes.DOUBLE,
        allowNull: true
      },
      is_hasVat: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      vat_percentage: {
        type: DataTypes.DOUBLE,
        allowNull: true
      },
      minimum_order_amount: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0.00
      },
      is_free_delivery: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      is_offer_available: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      is_vatInclusiveExclusive: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      is_taxInclusiveExclusive: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      is_online_payment: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      is_donation: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      is_hasDiscount: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      is_hasVoucher: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      average_cost: {
        type: DataTypes.STRING,
        allowNull: false
      },
      branch_type: {
        type: DataTypes.ENUM('restaurant', 'store'),
        allowNull: true 
      },
      order_type: {
        type: DataTypes.ENUM('delivery', 'pickup', 'both'),
        allowNull: true
      },
      availibility_status: {
        type: DataTypes.ENUM('open', 'close', 'busy'),
        allowNull: false,
        defaultValue: 'open'
      },
      approve_status: {
        type: DataTypes.ENUM('pending', 'approve', 'rejected'),
        allowNull: false,
        defaultValue: 'pending'
      },
      is_new: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 1
      },
      auto_accept_order: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      branch_commission_type: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      branch_commission: {
        type: DataTypes.DOUBLE,
        allowNull: true
      },
      min_order_amount: {
        type: DataTypes.DOUBLE,
        allowNull: true
      },
      is_mainBranch: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      is_recommended: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      is_asap: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 1
      },
      is_business: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 1
      },
      is_showboughttogether: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      contact_person_name: {
        type: DataTypes.STRING,
        allowNull: true
      },
      contact_person_email: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      contact_person_phone: {
        type: DataTypes.STRING,
        allowNull: true
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
  Branch.associate = (models) => {
    // associations can be defined here
    Branch.belongsTo(models.restaurant, {foreignKey: 'parent_id',as: 'restaurant'});
    Branch.belongsTo(models.store, {foreignKey: 'parent_id',as: 'store'});
    Branch.hasOne(models.user, {foreignKey: 'id', sourceKey: 'user_id', as: 'created_user'});
    Branch.hasMany(models.item, {foreignKey: 'branch_id', sourceKey:'id', as: 'item'})
  };
  return Branch;
};