import fs from "fs";
import path from "path";
import Sequelize from "sequelize";
import configs from "../database/config.js";
import dotenv from "dotenv";
dotenv.config();

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = configs[env];
const db = {};
const sequelize = config.use_env_variable
  ? new Sequelize(config.url, config)
  : new Sequelize(config.database, config.username, config.password, config);
fs.readdirSync(__dirname)
  .filter(
    file =>
      // eslint-disable-next-line implicit-arrow-linebreak
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
  )
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.Op = Sequelize.Op;

db.user = require("../models/user.js")(sequelize, Sequelize);
db.role = require("../models/role.js")(sequelize, Sequelize);
db.refreshtoken = require("../models/refreshtoken.js")(sequelize, Sequelize);

db.role.belongsToMany(db.user, {
  through: "user_roles",
  foreignKey: "roleId",
  otherKey: "userId"
});
db.user.belongsToMany(db.role, {
  through: "user_roles",
  foreignKey: "userId",
  otherKey: "roleId"
});
db.refreshtoken.belongsTo(db.user, {
  foreignKey: 'userId', targetKey: 'id'
});
db.user.hasOne(db.refreshtoken, {
  foreignKey: 'userId', targetKey: 'id'
});
db.ROLES = ["user", "admin", "vendor"];

module.exports = db; 