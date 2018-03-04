const express = require('express');
const router = express.Router();

const User = require('./../models/users');
const utils = require('../utils/utils');
const isAdmin = utils.isAdmin;

/* GET users listing. */
router.get('/userlist', isAdmin, function(req, res, next) {
  var userList = User.find({})
    .exec(function(err, userList){
      if( !userList){
        userList = [];    
      }
          
      res.render('admin/userlist', { userList : userList });
    });

});

module.exports = router;