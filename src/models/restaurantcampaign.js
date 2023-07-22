module.exports = (sequelize, DataTypes) => {
  const RestaurantCampaign = sequelize.define(
    "restaurant_campaign",
    {
      id: {
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.BIGINT
      },
      campaign_id: {
        type: DataTypes.BIGINT
      },
      branch_id: {
        type: DataTypes.BIGINT,
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
    {
      tableName: 'restaurant_campaigns'
    }
  );
  RestaurantCampaign.associate = (models) => {
    // associations can be defined here
    RestaurantCampaign.belongsTo(models.campaign, {foreignKey: 'campaign_id',as: 'campaign_aso'});
    RestaurantCampaign.hasOne(models.branch, {foreignKey: 'id',as: 'branch_aso'});
  };
  return RestaurantCampaign;
};