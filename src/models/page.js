module.exports = (sequelize, DataTypes) => {
    const Page = sequelize.define(
      "page",
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: DataTypes.BIGINT
        },
        page_title: {
          type: DataTypes.STRING
        },
        url_key: {
          type: DataTypes.STRING
        },
        meta_title: {
          type: DataTypes.STRING
        },
        meta_description: {
          type: DataTypes.TEXT
        },
        content: {
          type: DataTypes.TEXT
        },
        created_by: {
          type: DataTypes.BIGINT
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
      {
        schema: 'public',
        tableName: 'pages'
      }
    );
    Page.associate = (models) => {
      // associations can be defined here
      Page.belongsTo(models.user, {foreignKey: 'created_by',as: 'created_user'})
    };
    return Page;
  };