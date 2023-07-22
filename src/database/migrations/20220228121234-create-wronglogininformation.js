module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('wronglogininformations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      username: {
        type: Sequelize.STRING
      },
      logintime: {
        type: Sequelize.DATE
      },
      ipaddress: {
        type: Sequelize.STRING
      },
      machinename: {
        type: Sequelize.STRING
      },
      wronglogincounter: {
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
    await queryInterface.dropTable('wronglogininformations');
  }
};