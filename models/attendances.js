/*
* Sample Code From
* https://thinkster.io/tutorials/node-json-api/creating-the-user-model
*/
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const AttendancesSchema = new mongoose.Schema(
  {
    _id : {
      userId: {type: Schema.Types.ObjectId, ref: 'User'},
      date : {type: Date, required: [true, "can't be blank"]}
    },
    
    checkInList :[{time: Date, logType : String}],
    checkOutList :[{time: Date, logType : String}]
  },
  {timestamps: true}
);

module.exports = mongoose.model('Attendances', AttendancesSchema);
