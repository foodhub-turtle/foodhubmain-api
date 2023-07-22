import { v4 as uuidv4 } from 'uuid';
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('users', {
    id: {
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      type: Sequelize.INTEGER,
      defaultValue: Sequelize.INTEGER
    },
    firstName: {
      type: Sequelize.STRING
    },
    lastName: {
      type: Sequelize.STRING
    },
    email: {
      type: Sequelize.STRING
    },
    phone: {
      type: Sequelize.STRING
    },
    email_verified_at: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    password: {
      type: Sequelize.STRING
    },
    remember_token: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    verified: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    blocked: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: new Date()
    },
    updatedAt: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: new Date()
    },
  }),
  down: queryInterface => queryInterface.dropTable('users')
};