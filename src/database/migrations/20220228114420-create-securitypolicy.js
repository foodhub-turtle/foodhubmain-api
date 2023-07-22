module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('securitypolicies', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      securitypolicyid: {
        type: Sequelize.INTEGER
      },
      companyid: {
        type: Sequelize.INTEGER
      },
      maximumwronglogintry: {
        type: Sequelize.INTEGER
      },
      minimumpasswordlength: {
        type: Sequelize.INTEGER
      },
      passwordattemptwindow: {
        type: Sequelize.INTEGER
      },
      useronlinetimewindow: {
        type: Sequelize.INTEGER
      },
      isalphanumericpasswordrequired: {
        type: Sequelize.INTEGER
      },
      ispasswordsaltrequired: {
        type: Sequelize.INTEGER
      },
      ispasswordstrengthrequired: {
        type: Sequelize.INTEGER
      },
      isuniqueemailrequired: {
        type: Sequelize.INTEGER
      },
      isemployeeidrequired: {
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
    await queryInterface.dropTable('securitypolicies');
  }
};