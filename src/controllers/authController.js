const db = require("../models");
// const RefreshToken = require("../models/refreshtoken");
const config = require("../config/auth");
import catchAsync from "../libs/catchAsync";
import { hashPassword } from "../libs/passwordOp";
import _ from "lodash";
import { findUser } from "../services/index";
import { findAllBranch, findBranchByUserId } from "../services/branchService";
import { createCustomer, findByUserId } from "../services/customerService";
import { createOTP, findOtp, updateOtp } from "../services/otpService";
import { findLinkedUser } from "../services/permissionService.js";
const commonService = require("../services/commonService.js");
import { async } from "regenerator-runtime";
const settingsService = require("../services/settingsService");
var otpGenerator = require('otp-generator');
const passport = require('passport');
import axios from 'axios';
const { user, role, refreshtoken, branch, customer, setting, otp, link_user_permission, screen, rolescreenpermission, rider } = db;

// const User = db.user;
// const Role = db.role;

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
// Function to Compares dates (expiration time and current time in our case)
var dates = {
  convert:function(d) {
      // Converts the date in d to a date-object. The input can be:
      //   a date object: returned without modification
      //  an array      : Interpreted as [year,month,day]. NOTE: month is 0-11.
      //   a number     : Interpreted as number of milliseconds
      //                  since 1 Jan 1970 (a timestamp) 
      //   a string     : Any format supported by the javascript engine, like
      //                  "YYYY/MM/DD", "MM/DD/YYYY", "Jan 31 2009" etc.
      //  an object     : Interpreted as an object with year, month and date
      //                  attributes.  **NOTE** month is 0-11.
      return (
          d.constructor === Date ? d :
          d.constructor === Array ? new Date(d[0],d[1],d[2]) :
          d.constructor === Number ? new Date(d) :
          d.constructor === String ? new Date(d) :
          typeof d === "object" ? new Date(d.year,d.month,d.date) :
          NaN
      );
  },
  compare:function(a,b) {
      // Compare two dates (could be of any type supported by the convert
      // function above) and returns:
      //  -1 : if a < b
      //   0 : if a = b
      //   1 : if a > b
      // NaN : if a or b is an illegal date
      return (
          isFinite(a=this.convert(a).valueOf()) &&
          isFinite(b=this.convert(b).valueOf()) ?
          (a>b)-(a<b) :
          NaN
      );
  },
  inRange:function(d,start,end) {
      // Checks if date in d is between dates in start and end.
      // Returns a boolean or NaN:
      //    true  : if d is between start and end (inclusive)
      //    false : if d is before start or after end
      //    NaN   : if one or more of the dates is illegal.
     return (
          isFinite(d=this.convert(d).valueOf()) &&
          isFinite(start=this.convert(start).valueOf()) &&
          isFinite(end=this.convert(end).valueOf()) ?
          start <= d && d <= end :
          NaN
      );
  }
}
// To add minutes to the current time
function AddMinutesToDate(date, minutes) {
  return new Date(date.getTime() + minutes*60000);
}
export const facebookOAuth = catchAsync(async (req, res, next) => {
  console.log('called');
  [passport.authenticate("facebook")]
});
export const googleOAuth = catchAsync(async (req, res, next) => {
  return res.status(200).json({
    status: "success",
    statusCode: 200,
    message: "User registered successfully",
  });
});
export const optPhoneOAuth = catchAsync(async (req, res, next) => {
  try{

    const {phone_number,type} = req.body;

    let phone_message

    if(!phone_number){
      return res.status(400).json({
        status: "failure",
        statusCode: 400,
        message: "Phone Number not provided",
      });
    }
    if(!type){
      return res.status(400).json({
        status: "failure",
        statusCode: 400,
        message: "Type not provided",
      });
    }

    //Generate OTP 
    // const otpString = otpGenerator.generate(6, { digits: true, alphabets: false, upperCaseAlphabets : false, lowerCaseAlphabets: false, specialChars: false });
    const otpString = '000000';
    const now = new Date();
    const expiration_time = AddMinutesToDate(now,10);


    //Create OTP instance in DB
    const otp_instance = await createOTP(otp, {
      otp: otpString,
      user_phone_number: phone_number,
      expiration_time: expiration_time,
      verified: false
    });

    // Create details object containing the phone number and otp id
    var details={
      "timestamp": now,
      "check": phone_number,
      "otp": otp_instance.otp,
      "otp_id": otp_instance.id
    }

    // Encrypt the details object
    // const encoded= await encode(JSON.stringify(details))

    //Choose message template according type requested
    if(type){
      if(type=="VERIFICATION"){
        const message = require('../templates/SMS/phone_verification');
        phone_message =  message.message(otpString)
      }
      else if(type=="FORGET"){
        const message = require('../templates/SMS/phone_forget');
        phone_message =  message.message(otpString)
      }
      else if(type=="2FA"){
        const message = require('../templates/SMS/phone_2FA');
        phone_message = message.message(otpString)
      }
      else{
        return res.status(400).json({
          status: "failure",
          statusCode: 400,
          message: "Incorrect Type Provided",
        });
      }
    }
    return res.status(200).json({
      status: "success",
      statusCode: 200,
      message: 'OTP sent to user',
      data: details
    });
    // Settings Params for SMS
    var params = {
        Message: phone_message,
        PhoneNumber:  phone_number
    };
    axios.post('http://portal.metrotel.com.bd/smsapi', {
        "api_key" : "R20001015f5733d5ca18d3.08877421",
        "senderid" : "8809612440786",
        "scheduledDateTime" : new Date(),
        "type" : "Text",
        "msg" : params.Message,
        "contacts" : params.PhoneNumber
    })
    return res.status(200).json({
      status: "success",
      statusCode: 200,
      message: 'OTP sent to user',
      data: details
    });
    
  }catch(err){
    return res.status(400).json({
      status: "failure",
      statusCode: 400,
      message: err.message,
    });
  }
});
export const verifyOtp = catchAsync(async (req, res, next) => {
  try{
    var currentdate = new Date(); 
    // const {verification_key, otp, check} = req.body;
    const otpString = req.body.otp;
    const check = req.body.check;

    if(!otpString){
      return res.status(400).json({
        status: "failure",
        statusCode: 400,
        message: "OTP not Provided",
      });
    }
    if(!check){
      return res.status(400).json({
        status: "failure",
        statusCode: 400,
        message: "Phone Number not provided",
      });
    }

    let decoded;

    //Check if verification key is altered or not and store it in variable decoded after decryption
    // try{
    //   decoded = await decode(verification_key)
    // }
    // catch(err) {
    //   const response={"Status":"Failure", "Details":"Bad Request"}
    //   return res.status(400).send(response)
    // }

    // var obj= JSON.parse(decoded)
    // const check_obj = obj.check

    // Check if the OTP was meant for the same email or phone number for which it is being verified 
    // if(check_obj!=check){
    //   const response={"Status":"Failure", "Details": "OTP was not sent to this particular email or phone number"}
    //   return res.status(400).send(response) 
    // }

    const otp_instance= await findOtp(otp, {otp: otpString, user_phone_number: check})
    //Check if OTP is available in the DB
    if(otp_instance!=null){
      //Check if OTP is already used or not
      if(otp_instance.verified!=true){

          //Check if OTP is expired or not
          // if (dates.compare(otp_instance.expiration_time, currentdate)==1){

              //Check if OTP is equal to the OTP in the DB
              if(otpString === otp_instance.otp){
                  // Mark OTP as verified or used

                  const otpUpdate = await updateOtp(otp, {verified: false}, otp_instance.id)
                  const otpUser = await findByUserId(user, {phone: otp_instance.user_phone_number})
                  return res.status(200).json({
                    status: "success",
                    statusCode: 200,
                    message: "OTP Matched",
                    new_user: (otpUser) ? false : true 
                  });
              }
              else{
                return res.status(400).json({
                  status: "failure",
                  statusCode: 400,
                  message: "OTP NOT Matched",
                });
              }   
          // }
          // else{
          //   return res.status(400).json({
          //     status: "failure",
          //     statusCode: 400,
          //     message: "OTP Expired",
          //   });
          // }
      }
      else{
          return res.status(400).json({
            status: "failure",
            statusCode: 400,
            message: "OTP Already Used",
          });
        }
      }
    else{
      return res.status(400).json({
        status: "failure",
        statusCode: 400,
        message: "Bad Request",
      });
    }
  }catch(err){
    return res.status(400).json({
      status: "failure",
      statusCode: 400,
      message: err.message,
    });
  }
});
export const signup = catchAsync(async (req, res, next) => {
  const password = await hashPassword(req.body.password);

  const email = req.body.email.toLowerCase();
  req.body.email = email;
  req.body.password = password;
  user.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    phone: req.body.phone,
    password: req.body.password,
    verified: true
  })
    .then(async (result) => {
      await createCustomer(customer, {
        first_name: req.body.firstName,
        last_name: req.body.lastName,
        email: req.body.email,
        phone: req.body.phone,
        user_id: result.id,
        status: 0
      });
      
      if (req.body.roles) {
        role.findAll({
          where: {
            name: {
              [Op.or]: req.body.roles
            }
          }
        }).then(roles => {
          result.setRoles(roles).then(() => {
            // res.send({ message: "User was registered successfully!" });
          });
        });
      } else {
        // user role = 1
        result.setRoles([1]).then(() => {
          // res.send({ message: "User was registered successfully!" });
        });
      }
      return res.status(200).json({
        status: "success",
        statusCode: 200,
        user: _.omit(result.toJSON(), ["email_verified_at","remember_token","password", "updatedAt", "createdAt"]),
        message: "User registered successfully",
      });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
});

exports.signin = (req, res) => {
  var filter = {};

  // if(!_.isEmpty(req.body.email)) {
  //   filter.email = req.body.email;
  // } else {
  //   return res.status(403).send({
  //     statusCode: 403,
  //     message: "Please provide your email."
  //   });
  // }

  if(!_.isEmpty(req.body.phone)) {
    filter.phone = req.body.phone;
  } else {
    return res.status(400).send({
      statusCode: 400,
      message: "Please provide your phone number."
    });
  }
  
  filter.status = 1;
  if (!_.isEmpty(filter)) {
    console.log(filter);

  user.findOne({
    where: filter
  })
    .then(async (result) => {
      console.log(result);
      if (!result) {
        return res.status(403).send({
          statusCode: 403,
          message: "User Not found."
        });
      }

      const passwordIsValid = bcrypt.compareSync(
        req.body.password,
        result.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          statusCode: 401,
          message: "Invalid Password!"
        });
      }

      const token = jwt.sign({ id: result.id }, config.secret, {
        expiresIn: config.jwtExpiration
      });

      let refreshToken = await refreshtoken.createToken(result);

      let authorities = [];
      result.getRoles().then(async (roles) => {
        for (let i = 0; i < roles.length; i++) {
          authorities.push("ROLE_" + roles[i].name.toUpperCase());
        }
        let customerObj = await findByUserId(customer, {user_id: result.id});
        let settings = await settingsService.findOne(setting);

        res.status(200).send({
          id: result.id,
          user: _.omit(result.toJSON(), ["email_verified_at","remember_token","password", "updatedAt", "createdAt"]),
          roles: authorities,
          accessToken: token,
          refreshToken: refreshToken,
          customer: customerObj,
          settings: settings
        });
      });
    })
    .catch(err => {
      res.status(500).send({ 
        statusCode: 500,
        message: err.message 
      });
    });
  }else{
    return res.status(404).send({
      statusCode: 404,
      message: "INVALID_INPUT"
    });
  }
};
exports.signinadmin = (req, res) => {
  user.findOne({
    where: {
      email: req.body.email
    }
  })
  .then(async (result) => {
      if (!result) {
        return res.status(404).send({
          statusCode: 404,
          message: "EMAIL_NOT_FOUND"
        });
      }

      const passwordIsValid = bcrypt.compareSync(
        req.body.password,
        result.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          statusCode: 401,
          message: "INVALID_PASSWORD"
        });
      }

      const token = jwt.sign({ id: result.id }, config.secret, {
        expiresIn: config.jwtExpiration
      });

      let refreshToken = await refreshtoken.createToken(result);

      let authorities = [];
      result.getRoles().then(async (roles) => {
        for (let i = 0; i < roles.length; i++) {
          authorities.push("ROLE_" + roles[i].name.toUpperCase());
        }
        let settings = await settingsService.findOne(setting);
        let permisssions = [];
        let linkedUsers = (await commonService.findAllWithModelAndFilter(rolescreenpermission, {role_id: result.role_id}));
        for (let index = 0; index < linkedUsers.length; index++) {
          const element = linkedUsers[index];
          console.log(element.screen_code);
          let resultRole = await commonService.findWithModelAndFilter(screen, {screencode: {[Op.like]: "%"+element.screen_code+"%"}});
          let response = {
            screen_code: element.screen_code,
            url: resultRole.url,
            can_view: element.can_view,
            can_add: element.can_add,
            can_edit: element.can_edit,
            can_delete: element.can_delete,
            user_id: result.id,
            role_id: result.role_id
          } 
          permisssions.push(response);
        }
        
        // let linkedUser = (await findLinkedUser(link_user_permission, {user_id: result.id})).map((user) => {
        //   return parseInt(user.permission_id)
        // });

        res.status(200).send({
          id: result.id,
          user: _.omit(result.toJSON(), ["email_verified_at","remember_token","password", "updatedAt", "createdAt"]),
          roles: authorities,
          accessToken: token,
          refreshToken: refreshToken,
          settings: settings,
          linkedUser: permisssions
        });
      });
    })
    .catch(err => {
      console.log(err);

      res.status(500).send({ 
        statusCode: 500,
        message: err.message 
      });
    });
};
exports.signinvendor = (req, res) => {
  var filter = {};

  if(!_.isEmpty(req.body.email)){
    filter.email = req.body.email;
  }

  if(!_.isEmpty(req.body.phone)){
    filter.phone = req.body.phone;
  }
  console.log(filter);
  if (!_.isEmpty(filter)) {
  user.findOne({
    where: filter
  })
  .then(async (result) => {
      if (!result) {
        return res.status(404).send({
          statusCode: 404,
          message: "USER_NOT_FOUND"
        });
      }

      const passwordIsValid = bcrypt.compareSync(
        req.body.password,
        result.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          statusCode: 401,
          message: "INVALID_PASSWORD"
        });
      }

      const token = jwt.sign({ id: result.id }, config.secret, {
        expiresIn: config.jwtExpiration
      });

      let refreshToken = await refreshtoken.createToken(result);

      let authorities = [];
      result.getRoles().then(async (roles) => {
        for (let i = 0; i < roles.length; i++) {
          authorities.push("ROLE_" + roles[i].name.toUpperCase());
        }
        let branchObj = await findBranchByUserId(branch, {user_id: result.id});

        console.log(branchObj);
        if (branchObj.is_mainBranch == 1) {
            branchObj.otherBranch = await findAllBranch(branch, {parent_id: branchObj.parent_id, id: {[Op.ne]: branchObj.id}});
        }
        let settings = await settingsService.findOne(setting);

        res.status(200).send({
          id: result.id,
          user: _.omit(result.toJSON(), ["email_verified_at","remember_token","password", "updatedAt", "createdAt"]),
          roles: authorities,
          accessToken: token,
          branch: branchObj,
          refreshToken: refreshToken,
          settings: settings
        });
      });
    })
    .catch(err => {
      console.log(err);

      res.status(500).send({ 
        statusCode: 500,
        message: err.message 
      });
    });
  }else{
    return res.status(404).send({
      statusCode: 404,
      message: "INVALID_INPUT"
    });
  }
};
exports.signinrider = (req, res) => {
  var filter = {};

  if(!_.isEmpty(req.body.email)){
    filter.email = req.body.email;
  }

  if(!_.isEmpty(req.body.phone)){
    filter.phone = req.body.phone;
  }

  if (!_.isEmpty(filter)) {
  user.findOne({
    where: filter
  })
  .then(async (result) => {
      if (!result) {
        return res.status(404).send({
          statusCode: 404,
          message: "USER_NOT_FOUND"
        });
      }

      const passwordIsValid = bcrypt.compareSync(
        req.body.password,
        result.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          statusCode: 401,
          message: "INVALID_PASSWORD"
        });
      }

      const token = jwt.sign({ id: result.id }, config.secret, {
        expiresIn: config.jwtExpiration
      });

      let refreshToken = await refreshtoken.createToken(result);

      let authorities = [];
      result.getRoles().then(async (roles) => {
        for (let i = 0; i < roles.length; i++) {
          authorities.push("ROLE_" + roles[i].name.toUpperCase());
        }
        let riderObj = await commonService.findAllWithModelAndFilter(rider, {user_id: result.id});

       
        let settings = await settingsService.findOne(setting);

        res.status(200).send({
          id: result.id,
          user: _.omit(result.toJSON(), ["email_verified_at","remember_token","password", "updatedAt", "createdAt"]),
          roles: authorities,
          accessToken: token,
          rider: riderObj,
          refreshToken: refreshToken,
          settings: settings
        });
      });
    })
    .catch(err => {
      console.log(err);

      res.status(500).send({ 
        statusCode: 500,
        message: err.message 
      });
    });
  }else{
    return res.status(404).send({
      statusCode: 404,
      message: "INVALID_INPUT"
    });
  }
};

exports.refreshToken = async (req, res) => {
  const { refreshToken: requestToken } = req.body;

  if (requestToken == null) {
    return res.status(403).json({ 
      statusCode: 403,
      issue: 'REFRESH_TOKEN_REQUIRED',
      message: "Refresh Token is required!" 
    });
  }

  try {
    let refreshToken = await refreshtoken.findOne({ where: { token: requestToken } });
    if (!refreshToken) {
      res.status(403).json({
        statusCode: 403,
        issue: 'TOKEN_NOT_IN_DATABASE',
        message: "Refresh token is not in database!" 
      });
      return;
    }

    if (refreshtoken.verifyExpiration(refreshToken)) {
      refreshtoken.destroy({ where: { id: refreshToken.id } });
      
      res.status(403).json({
        statusCode: 403,
        issue: 'TOKEN_EXPIRED',
        message: "Refresh token was expired. Please make a new signin request",
      });
      return;
    }

    const user = await refreshToken.getUser();
    let newAccessToken = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: config.jwtExpiration,
    });

    return res.status(200).json({
      accessToken: newAccessToken,
      issue: 'TOKEN_SEND',
      statusCode: 200,
      refreshToken: refreshToken.token,
    });
  } catch (err) {
    return res.status(500).send({ 
      statusCode: 500,
      issue: 'TOKEN_WITH_ERROR',
      message: err 
    });
  }
};

export const updateUserPassword = catchAsync(async (req, res, next) => {
  const id = req.query.id;
  req.body.password = await hashPassword(req.body.password);
  user.update(
      {...req.body},
      {where: { id: id}}
  ).then(async (result) => {
    if (!result[0]) {
      return res.status(404).json({
        status: "fail",
        statusCode: 404,
        message: "User not found"
      });
    }
  
    const resultData = await user.findByPk(id);
    console.log(resultData);
  
    return res.status(201).json({
      status: "success",
      message: "User password updated successfully",
      statusCode: 200,
      payload: _.omit(resultData.toJSON(), ["updatedAt", "createdAt"])
    });
  })
  .catch(err => {
    return res.status(400).json({
        status: "fail",
        statusCode: 400,
        message: err.message
      });
  });

});
export const setUserPassword = catchAsync(async (req, res, next) => {
  const phone = req.query.phone;
  req.body.password = await hashPassword(req.body.password);
  var userObj = await findUser(user, {phone: phone});
  // userObj = userObj.toJSON();
  if (_.isEmpty(userObj)) {
    return res.status(404).json({
      status: "fail",
      statusCode: 404,
      message: "User not found"
    });
  }
  user.update(
      {...req.body},
      {where: { id: userObj.id}}
  ).then(async (result) => {
    if (!result[0]) {
      return res.status(404).json({
        status: "fail",
        statusCode: 404,
        message: "User not found"
      });
    }
  
    return res.status(201).json({
      status: "success",
      message: "User password updated successfully",
      statusCode: 201
    });
  })
  .catch(err => {
    return res.status(400).json({
        status: "fail",
        statusCode: 400,
        message: err.message
      });
  });

});
export const updateUserProfile = catchAsync(async (req, res, next) => {
  const id = req.query.id;
  customer.update(
      {...req.body},
      {where: { id: id}}
  ).then(async (result) => {
    if (!result[0]) {
      return res.status(404).json({
        status: "fail",
        statusCode: 404,
        message: "Customer not found"
      });
    }
    user.update(
        {...req.body},
        {where: { id: result.user_id}}
    ).then(async (result) => {
      if (!result[0]) {
        return res.status(404).json({
          status: "fail",
          statusCode: 404,
          message: "User not found"
        });
      }
    
    
      return res.status(201).json({
        status: "success",
        message: "Profile updated successfully",
        statusCode: 200
      });
    })
  
    return res.status(201).json({
      status: "success",
      message: "Profile updated successfully",
      statusCode: 200
    });
  })

  .catch(err => {
    return res.status(400).json({
        status: "fail",
        statusCode: 400,
        message: err.message
      });
  });

});