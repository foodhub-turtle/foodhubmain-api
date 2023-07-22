module.exports = (sequelize, DataTypes) => {
  const CMS = sequelize.define(
    "cms",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT
      },
      page: {
        type: DataTypes.STRING
      },
      section: {
        type: DataTypes.STRING
      },
      sub_section: {
        type: DataTypes.STRING
      },
      data_value: {
        type: DataTypes.JSON
      },
      user_id: {
        type: DataTypes.INTEGER
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
  CMS.associate = (models) => {
    // associations can be defined here
  };
  return CMS;
};