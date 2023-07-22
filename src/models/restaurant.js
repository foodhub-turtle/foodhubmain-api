module.exports = (sequelize, DataTypes) => {
  const Restaurant = sequelize.define(
    "restaurant",
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
      email: {
        type: DataTypes.STRING,
        allowNull: false
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false
      },
      business_legal_name: {
        type: DataTypes.STRING,
        allowNull: true
      },
      business_mobile: {
        type: DataTypes.STRING,
        allowNull: true
      },
      owner_name: {
        type: DataTypes.STRING,
        allowNull: true
      },
      owner_address: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      owner_email: {
        type: DataTypes.STRING,
        allowNull: true
      },
      owner_phone: {
        type: DataTypes.STRING,
        allowNull: true
      },
      owner_mobile: {
        type: DataTypes.STRING,
        allowNull: true
      },
      owner_nid_passport: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      contact_person_name: {
        type: DataTypes.STRING,
        allowNull: true
      },
      contact_person_email: {
        type: DataTypes.STRING,
        allowNull: true
      },
      contact_person_phone: {
        type: DataTypes.STRING,
        allowNull: true
      },
      business_category_id: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      category_id: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        allowNull: true
      },
      cuisine_id: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        allowNull: true
      },
      outlet_type: {
        type: DataTypes.ENUM('restaurant', 'store'),
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
  Restaurant.associate = (models) => {
    // associations can be defined here
    
  };
  return Restaurant;
};