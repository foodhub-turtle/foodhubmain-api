module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('campaigns', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      url_key: {
        type: Sequelize.STRING,
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
      is_active: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      is_showonfront: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      created_by: {
        type: Sequelize.BIGINT,
        allowNull: false
      },
      status: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('campaigns');
  }
};