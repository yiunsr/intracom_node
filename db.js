const mongoose = require('mongoose');
var config = require('./config/config');

module.exports = () => {
  function connect() {
    var DB_URL = "mongodb://" + config.dbUser + ":" + config.dbPassword + "@";
    DB_URL += config.dbURL + ":" + config.dbPort + "/" + config.dbname;
    //var DB_URL = "mongodb://testUser:In2ra_pw@localhost:27017/intracom_node";
    
    //mongoose.Promise = global.Promise;
    mongoose.connect(DB_URL, function(err) {
      if (err) {
        console.error('mongodb connection error', err);
      }
      console.log('mongodb connected');
    });
  }
  connect();
  mongoose.connection.on('disconnected', connect);
};