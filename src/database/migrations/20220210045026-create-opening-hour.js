module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('opening_hours', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      restaurant_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      branch_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      days: {
        type: Sequelize.ENUM('saturday', 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday'),
        allowNull: false
      },
      fromHour: {
        type: Sequelize.STRING,
        allowNull: false
      },
      toHour: {
        type: Sequelize.STRING,
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
    }),
    down: queryInterface => queryInterface.dropTable('opening_hours')
  };