module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Promotions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      title: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      url_key: {
        type: Sequelize.STRING,
        allowNull: false
      },
      image: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      banner_image: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      priority: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      start_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      end_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      created_by: {
        type: Sequelize.BIGINT,
        allowNull: false
      },
      is_active: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      is_showonfront: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      status: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: new Date()
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: new Date()
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Promotions');
  }
};