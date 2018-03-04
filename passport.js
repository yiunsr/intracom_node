// http://www.passportjs.org/docs/username-password/

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;  // 유저를 직접 구현할 때 사용함
const Users = require('./model/user');

module.exports = () => {
  passport.use(new LocalStrategy(
      function(username, password, done) {
        User.findOne({ email: username }, function(err, user) {
          if (err) { return done(err); }
          if (!user) {
            return done(null, false, { message: 'Incorrect username.' });
          }
          if (!user.validPassword(password)) {
            return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user);
      });
    }
  ));
      
};