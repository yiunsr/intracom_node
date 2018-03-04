const express = require('express');
const router = express.Router();
const passport = require('passport');

var ObjectId = require('mongoose').Types.ObjectId; 
const Attendance = require('./../models/attendances');
const utils = require('../utils/utils');
const isAuthenticated = utils.isAuthenticated;

/* 출퇴근 화면 */
router.get('/index', isAuthenticated, function(req, res, next) {

  let now = new Date();
  let curDateOnly = new Date(now.getTime() - 1000*60*60*PREHOURE);

  //// UTC 로 생성해서 넣어야 UTC 시간으로 들어간다. 
  curDateOnly = new Date(Date.UTC(curDateOnly.getFullYear(), curDateOnly.getMonth(), curDateOnly.getDate()));
  const conditions  = { _id : {userId:req.user, date:curDateOnly}};

  var attendanceList = Attendance.aggregate([
    { $match :  conditions },
    { 
      $project: 
      { 
        "_id": "$_id",
        "checkIn": { "$min": {"$min" :  "$checkInList"} }, 
        "checkOut": { "$max": {"$max" :  "$checkOutList"} } 
      } 
    },
    { $project: { 
      userId: "$_id.userId._id", 
      username : "$_id.userId.username", 
      date: "$_id.date", 
      checkIn : "$checkIn.time", 
      checkOut : "$checkOut.time"} 
    }
  ])
  .exec(function(err, attendanceList){
    if( attendanceList && attendanceList.length &&  attendanceList[0].checkIn ){
      // 출근 기록 있음
      checkIn = "disabled";
      checkOut = "";
    }else{
      // 출근 기록이 없을 때
      checkIn = "";
      checkOut = "disabled";
    }
      
    res.render('attendances/index', { checkIn : checkIn, checkOut : checkOut });
  });


});

/* 출퇴근 리스트 */
router.get('/list', isAuthenticated, function(req, res, next) {
  const bAdmin = req.user.usertype == "admin";
  var match = { "_id.userId._id" : new ObjectId(req.user.id) };
  if(bAdmin){
    match = {};
  }
    

  var attendanceList = Attendance.aggregate([
    { $match :  match },
    { 
      $project: 
      { 
        "_id": "$_id",
        "checkIn": { "$min": {"$min" :  "$checkInList"} }, 
        "checkOut": { "$max": {"$max" :  "$checkOutList"} } 
      } 
    },
    { $project: { 
      userId: "$_id.userId._id", 
      username : "$_id.userId.username", 
      date: "$_id.date", 
      checkIn : "$checkIn.time", 
      checkOut : "$checkOut.time"} 
    }
  ])
  .exec(function(err, attendanceList){
    if(!attendanceList)
      attendanceList = [];
    res.render('attendances/list', { attendanceList : attendanceList });
  });
  
});

const PREHOURE = 6;
router.post('/checkin', isAuthenticated, function(req, res, next) {
  console.log('/checkin ' + req.user.id );

  //// 06:00 ~ 다음날 05:59 까지는 동일 
  let now = new Date();
  let curDateOnly = new Date(now.getTime() - 1000*60*60*PREHOURE);

  //// UTC 로 생성해서 넣어야 UTC 시간으로 들어간다. 
  curDateOnly = new Date(Date.UTC(curDateOnly.getFullYear(), curDateOnly.getMonth(), curDateOnly.getDate()));
  const conditions  = { _id : {userId:req.user, date:curDateOnly}};
  const update = { $setOnInsert : { checkOutList : [] },
    $push: {  checkInList : 
      {$each : [{time : now, logType : "in" }]}
    }
  };
  const option = { upsert: 1 };
  
  Attendance.update(conditions, update, option, function (err, attendance) {
    if (err){
      res.json({result: false});
      return
    }
      
    res.json({result: true, attendance : attendance});
  });
  
});
router.post('/checkout', isAuthenticated, function(req, res, next) {
  console.log('/checkout ' + req.user.id );

  //// 06:00 ~ 다음날 05:59 까지는 동일 
  let now = new Date();
  let curDateOnly = new Date(now.getTime() - 1000*60*60*PREHOURE);

  //// UTC 로 생성해서 넣어야 UTC 시간으로 들어간다. 
  curDateOnly = new Date(Date.UTC(curDateOnly.getFullYear(), curDateOnly.getMonth(), curDateOnly.getDate()));
  const conditions  = { _id : {userId:req.user, date:curDateOnly}};
  const update = { $setOnInsert : { checkInList : [] },
    $push: {  checkOutList : 
      {$each : [{time : now, logType : "out" }]}
    }
  };
  const option = { upsert: 1 };
 
  Attendance.update(conditions, update, option, function (err, attendance) {
    if (err){
      res.json({result: false});
      return
    }
     
    res.json({result: true, attendance : attendance});
  });
});


module.exports = router;

