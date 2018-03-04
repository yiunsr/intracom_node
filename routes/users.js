const express = require('express');
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('./../models/users');
const utils = require('../utils/utils');
const isAuthenticated = utils.isAuthenticated;

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/login', function(req, res, next) {
  res.render('users/login', { title: 'IntraCom Login', layout: 'emptrybase' })
});
router.post('/login', passport.authenticate('local'), function(req, res, next) {
  req.user.lastlogin = new Date();
  req.user.save();
  res.json({ result: true, redirect : "/" });
});


router.get('/signup', function(req, res, next) {
  res.render('users/signup', { title: 'IntraCom Signup', layout: 'emptrybase' })
});

router.post('/signup', function(req, res, next) {
  console.log('signup user');
  const newUser = new User({username: req.body.email, email : req.body.email, usertype : "user", lastlogin : new Date()  });
  User.register(
    newUser, req.body.password, function(err) {
      if (err) {
        console.log('error while user singup!', err);
        res.status(200).json({ result: true, redirect : "/" });
        return next(err);
      }

      console.log('user singup!');

    //res.redirect('/');
      res.status(200).json({ result: true, redirect : "/" });
    }
  );
});

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

router.get('/profile', isAuthenticated, function(req, res, next) {
  res.render('users/profile', { title: 'Profile' })
});

router.post('/profile', isAuthenticated, function(req, res, next) {
  req.user.changePassword( req.body.oldPassword, req.body.newPassword, function(err, result){
    if (err) {
      console.log('oldpassword mismatch', err);
      res.status(200).json({ result: false, detail:"기존 패스워드가 맞지 않습니다. "  });
    }
    else{
      res.status(200).json({ result: true});
    }
  });
});

module.exports = router;

