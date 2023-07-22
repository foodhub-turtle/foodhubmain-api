const db = require("../models");
const {user, ROLES} = db;

const checkDuplicateUsernameOrPhone = (req, res, next) => {
  // phone
  user.findOne({
    where: {
      phone: req.body.phone
    }
  }).then(result => {
    if (result) {
      res.status(400).send({
        statusCode: 400,
        message: "Failed! phone is already in use!"
      });
      return;
    }
    next();
  });
};

const checkRolesExisted = (req, res, next) => {
  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!ROLES.includes(req.body.roles[i])) {
        res.status(400).send({
          statusCode: 400,
          message: "Failed! Role does not exist = " + req.body.roles[i]
        });
        return;
      }
    }
  }
  
  next();
};

const verifySignUp = {
  checkDuplicateUsernameOrPhone: checkDuplicateUsernameOrPhone,
  checkRolesExisted: checkRolesExisted
};

module.exports = verifySignUp;