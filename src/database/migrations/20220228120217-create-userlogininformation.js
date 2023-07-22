module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('userlogininformations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      slno: {
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER
      },
      username: {
        type: Sequelize.STRING
      },
      logintime: {
        type: Sequelize.DATE
      },
      updateduseractivitytime: {
        type: Sequelize.DATE
      },
      logouttime: {
        type: Sequelize.DATE
      },
      ipaddress: {
        type: Sequelize.STRING
      },
      machinename: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('userlogininformations');
  }
};