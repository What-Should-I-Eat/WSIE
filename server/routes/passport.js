const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../src/models/userModel'); // Adjust with your user model

passport.use(new LocalStrategy(
  async function(username, password, done) {
    try {
      const user = await User.findOne({ username: username });
      if (!user || !user.validPassword(password)) {
        return done(null, false, { message: 'Invalid username or password' });
      }
      return done(null, user);
    } 
    catch (err) {
      return done(err);
    }
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(async function(id, done) {
  try {
    const user = await User.findById(id);
    done(null, user);
  } 
  catch (err) {
    done(err);
  }
});

module.exports = passport;
