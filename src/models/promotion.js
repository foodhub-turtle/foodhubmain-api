module.exports = (sequelize, DataTypes) => {
  const Promotion = sequelize.define(
    "promotion",
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
      branch_ids: {
        type: DataTypes.ARRAY(DataTypes.BIGINT),
        allowNull: true
      },
      url_key: {
        type: DataTypes.STRING,
        allowNull: false
      },
      priority: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      start_date: {
        type: DataTypes.DATE,
        allowNull: false
      },
      end_date: {
        type: DataTypes.DATE,
        allowNull: false
      },
      is_showonfront: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      is_all_branch: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      created_by: {
        type: DataTypes.BIGINT,
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
      tableName: 'promotions'
    }
  );
  Promotion.associate = (models) => {
    // associations can be defined here
    Promotion.hasMany(models.restaurant_campaign, {foreignKey: 'campaign_id', as: 'campaign_aso'});
    Promotion.belongsTo(models.user, {foreignKey: 'created_by',as: 'created_user'});

  };
  return Promotion;
};