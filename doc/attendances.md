## 출퇴근 스키마 & 로직


### 출퇴근 스키마
* 
```xml
 {
    _id : {
      userId: {type: Schema.Types.ObjectId, ref: 'User'},
      date : {type: Date, required: [true, "can't be blank"]}
    },
    
    checkInList :[{time: Date, logType : String}],
    checkOutList :[{time: Date, logType : String}]
  },
```
  * userId 와 date 를 key 복합키로 한다. 
    * date 는 유저의 출퇴근 하는 년월일이앋.
  * checkInList 의 경우 출근로그이다. 일반적으로 리스트 하나만 존재해야 한다. 중복 출근체크가 안되도록 시스템상에서 막아야 하나 중복 출근체크가 되더라도 min 값만 추출하면 출근시간이다.
  * checkOutList 는 퇴근로그이다. 일반적으로 퇴근시간이 생각하던 것 외로 지연될 수 있으므로 리스트 형태가 될 수 있다. max 값을 추출하면 하당일짜의 퇴근시간이다. 퇴근 시간의 경우 야근을 고려하여 다음날 06까지는 전날의 퇴근으로 기록된다.
  * 밤을 새서 일하는 경우, 다음날 06:00 전까지 퇴근을 체크하고 다음날 06:00 이후에 다시 출근을 체크해야 한다. 

### 출근기록

```xml
Attendance.update(
 { _id : {userId:req.user, date:curDateOnly}},
 {$setOnInsert : { checkOutList : [] },
    $push: {  checkInList : 
      {$each : [{time : now, logType : "in" }]}
    }
  }, 
  { upsert: 1 }
)
```
* update 함수는 (업데이트할 조건, 업데이트할 데이터, 업데이트 옵션)  으로 이루어진다.
* curDateOnly 는 출퇴근을 기록한 날짜로 UTC로 들어가고 2010-01-01 00:00:00 으로 시간은 00시로 들어간다.
* upsert 는 데이터가 없는 경우 데이터를 insert 하기를 요청한다.
* $setOnInsert는 데이가 없는 경우 추가될 때의 동작이다.
* $push의 경우 array 가 되는 데이터를 추가한다. 이 때 $each 의 경우 리스트를 extend 하는 식으로 추가한다. 
* 데이터가 추가되는 것은 현재 시간(now) 과 logType 은 "in"이다. 

### 퇴근기록
```xml
Attendance.update(
 { _id : {userId:req.user, date:curDateOnly}},
 {$setOnInsert : { checkInList : [] },
    $push: {  checkOutList : 
      {$each : [{time : now, logType : "out" }]}
    }
  }, 
  { upsert: 1 }
)
```
* 데이터가 추가되는 것은 현재 시간(now) 과 logType 은 "in"이다. 

### 출퇴근 기록 추출

```xml
Attendance.aggregate([
    { $match :  { "_id.userId._id" : new ObjectId(req.user.id) } },
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
```
 * $match 를 통해 현재 사용자 정보만 가져온다. admin 의 경우 { $match :  { } } 를 하면 전체를 가져온다.
 * $project 내 _id 는 그룹핑한 데이터로 여기서는 userId 와 date 이다. 
   * $min, $max 가 가장 핵심으로 출근시간은 최소값, 퇴근시간은 최대값을 가져온다. 
* project 를 통해서 데이터를 정돈한다. 해당부분은 alias(별칭)을 사용하는 기능과 필요한 데이터를 추출하는 역할을 한다. 마치 SQL의 select 부분이다.


  