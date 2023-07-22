module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      access_level: {
        type: Sequelize.STRING
      },
      username: {
        type: Sequelize.STRING
      },
      userfullname: {
        type: Sequelize.TEXT
      },
      registration_id: {
        type: Sequelize.INTEGER
      },
      registration_type: {
        type: Sequelize.INTEGER
      },
      password: {
        type: Sequelize.TEXT
      },
      role_id: {
        type: Sequelize.INTEGER
      },
      isactive: {
        type: Sequelize.INTEGER
      },
      changepassword: {
        type: Sequelize.INTEGER
      },
      islockedout: {
        type: Sequelize.INTEGER
      },
      setdate: {
        type: Sequelize.DATE
      },
      createdby: {
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
    await queryInterface.dropTable('users');
  }
};