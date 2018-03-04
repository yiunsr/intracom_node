
'use strict';
var config = require('./config');
const User = require('./../models/users');

module.exports = function(app, db) {
  
  User.findOne({ email: config.adminAccountEmail}, function(err, user) {
    if (err) throw err;
    if(user)
      return;

    const newUser = new User({username: config.adminAccountEmail, email : config.adminAccountEmail, usertype : "admin" });
    User.register(
      newUser, config.adminPassword, function(err) {
        if (err) {
          console.log('error Admin User Created ', err);
        }
        else{
          console.log('Admin User Created');
        }
    
      }    
    );
  });
    
};

