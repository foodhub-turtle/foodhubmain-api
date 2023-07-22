module.exports = (sequelize, DataTypes) => {
  const Campaign = sequelize.define(
    "campaign",
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
      image: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      banner_image: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      priority: {
        type: DataTypes.INTEGER,
        allowNull: false
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
      is_all_branch: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      created_by: {
        type: DataTypes.BIGINT,
        allowNull: false
      },
      voucher_campaign: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      voucher_campaign_id: {
        type: DataTypes.BIGINT,
        allowNull: true
      },
      is_showonfront: {
        type: DataTypes.INTEGER,
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
      tableName: 'campaigns'
    }
  );
  Campaign.associate = (models) => {
    // associations can be defined here
    Campaign.belongsTo(models.user, {foreignKey: 'created_by',as: 'created_user'});

  };
  return Campaign;
};