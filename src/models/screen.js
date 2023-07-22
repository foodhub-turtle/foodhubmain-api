module.exports = (sequelize, DataTypes) => {
  const Screen = sequelize.define(
    "screen",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT
      },
      screencode: {
        type: DataTypes.STRING,
        allowNull: false
      },
      screenname: {
        type: DataTypes.STRING,
        allowNull: false
      },
      module_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      sub_module_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      original: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      url: {
        type: DataTypes.STRING,
        allowNull: false
      },
      parentscreencode: {
        type: DataTypes.STRING,
        allowNull: false
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      isrequiredforapproval: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      isfinancialscreen: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      isselfservicescreen: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      setdate: {
        type: DataTypes.DATE,
        allowNull: false
      },
      user_id: {
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
      schema: 'security',
      tableName: 'screen'
    }
  );
  Screen.associate = (models) => {
    // associations can be defined here
  };
  return Screen;
};