
const express = require('express');
var Config = require('./config.json')

const app = express();
const envType = app.get('env');

if(envType == "production"){
  Config[envType]["dbURL"] = process.env.dbURL;
  Config[envType]["dbPort"] = process.env.dbPort;
}

module.exports = Config[envType];
