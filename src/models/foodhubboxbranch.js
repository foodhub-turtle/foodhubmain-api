module.exports = (sequelize, DataTypes) => {
    const FoodHubBoxBranch = sequelize.define(
      "foodhubboxbranch",
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: DataTypes.BIGINT
        },
        branch_id: {
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
        priority: {
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
        schema: 'public',
        tableName: 'foodhub_box_branches'
      }
    );
    FoodHubBoxBranch.associate = (models) => {
      // associations can be defined here
    };
    return FoodHubBoxBranch;
  };