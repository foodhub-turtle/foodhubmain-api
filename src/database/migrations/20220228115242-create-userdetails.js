module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('userdetails', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      lastlogindate: {
        type: Sequelize.DATE
      },
      lastpasswordchangeddate: {
        type: Sequelize.DATE
      },
      lastlockoutdate: {
        type: Sequelize.DATE
      },
      isloggedin: {
        type: Sequelize.INTEGER
      },
      failedpasswordattemptcount: {
        type: Sequelize.INTEGER
      },
      emailaddress: {
        type: Sequelize.STRING
      },
      setdate: {
        type: Sequelize.DATE
      },
      createdbyuserid: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('userdetails');
  }
};