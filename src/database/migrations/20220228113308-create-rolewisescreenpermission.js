module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('rolewisescreenpermissions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      role_id: {
        type: Sequelize.INTEGER
      },
      company_id: {
        type: Sequelize.INTEGER
      },
      screencode: {
        type: Sequelize.STRING
      },
      accessright: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('rolewisescreenpermissions');
  }
};