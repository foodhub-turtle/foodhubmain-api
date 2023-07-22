const User = require("../models/index")["User"];
const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
//
//
//  PASSPORT CONFIG
//
//
module.exports = function (passport) {
  passport.serializeUser(function (user, done) {
    done(null, user);
  });

  passport.deserializeUser(function (user, done) {
    done(null, user);
  });

  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: process.env.FACEBOOK_APP_CALLBACK_URL,
      },
      async function (accessToken, refreshToken, profile, cb) {
        console.log(profile);
        // const [user, status] = await findOrCreate(user, {
        //   where: {
        //     facebookid: profile.id,
        //     first_name: profile.displayName,
        //     registration_type: "facebook",
        //   },
        // });
        // firstname: profile.name.givenName,
        // lastname: profile.name.familyName,
        cb(null, user);
      }
    )
  );

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_APP_CALLBACK_URL,
      },
      async function (accessToken, refreshToken, profile, cb) {
        console.log(profile);
        return done(null, profile);
        // const [user, status] = await User.findOrCreate({
        //   where: {
        //     social_user_id: profile.id,
        //     name: profile.displayName,
        //     registration_type: "google",
        //   },
        // });
        cb(null, user);
      }
    )
  );
};