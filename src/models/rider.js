module.exports = (sequelize, DataTypes) => {
  const Rider = sequelize.define(
    "rider",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT
      },
      rider_uid: {
        type: DataTypes.STRING,
        allowNull: true
      },
      first_name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      last_name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      image: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false
      },
      address: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      parmanent_address: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      nid: {
        type: DataTypes.STRING,
        allowNull: false
      },
      emergency_contact_name: {
        type: DataTypes.STRING,
        allowNull: true
      },
      emergency_contact_phone: {
        type: DataTypes.STRING,
        allowNull: true
      },
      reference_id: {
        type: DataTypes.STRING,
        allowNull: true
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      is_active: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      avg_rating: {
        type: DataTypes.DOUBLE,
        allowNull: true
      },
      status: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      vehicle_type: {
        type: DataTypes.ENUM('bicycle', 'bike'),
        allowNull: true
      },
      delivery_status: {
        type: DataTypes.ENUM('ongoing', 'available', 'issue','break', 'stop'),
        allowNull: true
      },
      joined_at: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: new Date()
      },
      active_contract: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: new Date()
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
  Rider.associate = (models) => {
    // associations can be defined here
    Rider.hasOne(models.user, {foreignKey: 'id', sourceKey: 'user_id', as: 'created_user'});
  };
  return Rider;
};