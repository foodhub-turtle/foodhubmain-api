module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('screens', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      screencode: {
        type: Sequelize.STRING
      },
      screenname: {
        type: Sequelize.STRING
      },
      module_id: {
        type: Sequelize.INTEGER
      },
      sub_module_id: {
        type: Sequelize.INTEGER
      },
      original: {
        type: Sequelize.INTEGER
      },
      url: {
        type: Sequelize.STRING
      },
      parentscreencode: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.TEXT
      },
      isrequiredforapproval: {
        type: Sequelize.INTEGER
      },
      isfinancialscreen: {
        type: Sequelize.INTEGER
      },
      isselfservicescreen: {
        type: Sequelize.INTEGER
      },
      setdate: {
        type: Sequelize.DATE
      },
      user_id: {
        type: Sequelize.INTEGER
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
    await queryInterface.dropTable('screens');
  }
};