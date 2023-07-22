module.exports = (sequelize, DataTypes) => {
  const Module = sequelize.define(
    "module",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT
      },
      modulename: {
        type: DataTypes.STRING,
        allowNull: false
      },
      setdate: {
        type: DataTypes.DATE,
        allowNull: false
      },
      iconname: {
        type: DataTypes.STRING,
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
      tableName: 'modules'
    }
  );
  Module.associate = (models) => {
    // associations can be defined here
  };
  return Module;
};