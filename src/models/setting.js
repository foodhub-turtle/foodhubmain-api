module.exports = (sequelize, DataTypes) => {
  const Setting = sequelize.define(
    "setting",
    {
      id: {
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.BIGINT
      },
      app_name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      app_description: {
        type: DataTypes.STRING,
        allowNull: true
      },
      app_meta_keyword: {
        type: DataTypes.STRING,
        allowNull: true
      },
      app_meta_description: {
        type: DataTypes.STRING,
        allowNull: true
      },
      app_email: {
        type: DataTypes.STRING,
        allowNull: true
      },
      app_contact_no: {
        type: DataTypes.STRING,
        allowNull: true
      },
      app_contact_address: {
        type: DataTypes.STRING,
        allowNull: true
      },
      app_currency_code: {
        type: DataTypes.STRING,
        allowNull: true
      },
      app_currency_symbol: {
        type: DataTypes.STRING,
        allowNull: true
      },
      site_copyright: {
        type: DataTypes.STRING,
        allowNull: true
      },
      play_store_link: {
        type: DataTypes.STRING,
        allowNull: true
      },
      app_store_link: {
        type: DataTypes.STRING,
        allowNull: true
      },
      map_key: {
        type: DataTypes.STRING,
        allowNull: true
      },
      site_logo: {
        type: DataTypes.STRING,
        allowNull: true
      },
      site_logo_tablet: {
        type: DataTypes.STRING,
        allowNull: true
      },
      site_logo_mobile: {
        type: DataTypes.STRING,
        allowNull: true
      },
      site_fav_icon: {
        type: DataTypes.STRING,
        allowNull: true
      },
      site_facebook_url: {
        type: DataTypes.STRING,
        allowNull: true
      },
      site_youtube_url: {
        type: DataTypes.STRING,
        allowNull: true
      },
      site_twitter_url: {
        type: DataTypes.STRING,
        allowNull: true
      },
      site_instagram_url: {
        type: DataTypes.STRING,
        allowNull: true
      },
      site_google_url: {
        type: DataTypes.STRING,
        allowNull: true
      },
      allow_auto_accept: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      allow_distance_fraction: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      distance_rounding: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      min_distance_min_fee: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0.00
      },
      min_delivery_fee: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0.00
      },
      fee_per_km: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0.00
      },
      foodhub_box_time_limit: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      foodhub_box_branch_limit: {
        type: DataTypes.INTEGER,
        allowNull: true,
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
  Setting.associate = () => {
    // associations can be defined here
  };
  return Setting;
};