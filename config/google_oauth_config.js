var GoogleStrategy = require('passport-google-oauth20').Strategy;
const {userModel} = require('../models/user');
const passport = require("passport");

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback"
  },
  async function(accessToken, refreshToken, profile, cb) {
    try{
      let user = await userModel.findOne({ email: profile.emails[0].value });

      if(!user){
        user = new userModel({
          name: profile.displayName,
          email:  profile.emails[0].value,
        });

        await user.save();
      }
      cb(null, user);
    }
    catch(err){
      cb(err,false);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  let user = await userModel.findOne({ _id: id });
  done(null, user);
});

module.exports = passport;