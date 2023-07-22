module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('userroles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      company_id: {
        type: Sequelize.STRING
      },
      role_id: {
        type: Sequelize.INTEGER
      },
      role_name: {
        type: Sequelize.STRING
      },
      roledescription: {
        type: Sequelize.TEXT
      },
      isselfservice: {
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
    await queryInterface.dropTable('userroles');
  }
};