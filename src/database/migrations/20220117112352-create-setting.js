import { v4 as uuidv4 } from 'uuid';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('settings', {

      id: {
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        type: Sequelize.INTEGER,
        defaultValue: Sequelize.INTEGER
      },
      app_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      app_description: {
        type: Sequelize.STRING,
        allowNull: true
      },
      app_meta_keyword: {
        type: Sequelize.STRING,
        allowNull: true
      },
      app_meta_description: {
        type: Sequelize.STRING,
        allowNull: true
      },
      app_email: {
        type: Sequelize.STRING,
        allowNull: true
      },
      app_contact_no: {
        type: Sequelize.STRING,
        allowNull: true
      },
      app_contact_address: {
        type: Sequelize.STRING,
        allowNull: true
      },
      app_currency_code: {
        type: Sequelize.STRING,
        allowNull: true
      },
      app_currency_symbol: {
        type: Sequelize.STRING,
        allowNull: true
      },
      site_copyright: {
        type: Sequelize.STRING,
        allowNull: true
      },
      play_store_link: {
        type: Sequelize.STRING,
        allowNull: true
      },
      app_store_link: {
        type: Sequelize.STRING,
        allowNull: true
      },
      map_key: {
        type: Sequelize.STRING,
        allowNull: true
      },
      site_logo_desktop: {
        type: Sequelize.STRING,
        allowNull: true
      },
      site_logo_tablet: {
        type: Sequelize.STRING,
        allowNull: true
      },
      site_logo_mobile: {
        type: Sequelize.STRING,
        allowNull: true
      },
      site_fav_icon: {
        type: Sequelize.STRING
      },
      site_facebook_url: {
        type: Sequelize.STRING,
        allowNull: true
      },
      site_youtube_url: {
        type: Sequelize.STRING,
        allowNull: true
      },
      site_twitter_url: {
        type: Sequelize.STRING,
        allowNull: true
      },
      site_instagram_url: {
        type: Sequelize.STRING,
        allowNull: true
      },
      site_google_url: {
        type: Sequelize.STRING,
        allowNull: true
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
  down: queryInterface => queryInterface.dropTable('settings')
};