const { TokenExpiredError } = require("jsonwebtoken");
const jwt = require("jsonwebtoken");
const config = require("../config/auth.js");
const db = require("../models");
const user = db.user;

const catchError = (err, res) => {
  
  if (err instanceof TokenExpiredError) {
    return res.status(403).send({ 
      statusCode: 403,
      message: "Unauthorized! Access Token was expired!",
      issue: 'ACCESS_TOKEN_EXPIRED'
    });

  }

  return res.status(403).send({
    statusCode: 401,
    message: "Unauthorizeds!",
    issue: 'UNAUTHORIZED',
  });
}

const verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];
  if (!token) {
    return res.status(403).send({
      statusCode: 403,
      message: "No token provided!",
      issue: 'TOKEN_REQUIRED',
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return catchError(err, res);
    }
    req.userId = decoded.id;
    next();
  });
};

const isAdmin = (req, res, next) => {
  user.findByPk(req.userId).then(result => {
    result.getRoles().then(roles => {
      console.log(roles);
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "admin") {
          next();
          return;
        }
      }

      res.status(403).send({
        statusCode: 403,
        message: "Require Admin Role!"
      });
      return;
    });
  });
};

const isRider = (req, res, next) => {
  user.findByPk(req.userId).then(result => {
    result.getRoles().then(roles => {
      console.log(roles);
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "rider") {
          next();
          return;
        }
      }

      res.status(403).send({
        statusCode: 403,
        message: "Require Rider Role!"
      });
      return;
    });
  });
};

const isModerator = (req, res, next) => {
  user.findByPk(req.userId).then(result => {
    result.getRoles().then(roles => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "vendor") {
          next();
          return;
        }
      }

      res.status(403).send({
        statusCode: 403,
        message: "Require Vendor Role!"
      });
    });
  });
};

const isModeratorOrAdmin = (req, res, next) => {
  user.findByPk(req.userId).then(result => {
    result.getRoles().then(roles => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "moderator") {
          next();
          return;
        }

        if (roles[i].name === "admin") {
          next();
          return;
        }
      }

      res.status(403).send({
        statusCode: 403,
        message: "Require Vendor or Admin Role!",
        issue: 'ADMIN_ROLE_REQUIRED',
      });
    });
  });
};

const authJwt = {
  verifyToken: verifyToken,
  isAdmin: isAdmin,
  isRider: isRider,
  isModerator: isModerator,
  isModeratorOrAdmin: isModeratorOrAdmin
};
module.exports = authJwt;