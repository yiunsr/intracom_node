var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  if (!req.user){
    res.redirect("/users/login");
  }
  else{
    //res.redirect("/main")
    res.redirect("/attendances/index");
    
  }
});


router.get('/main', function(req, res, next) {
  res.render('main', {  })
});

module.exports = router;
