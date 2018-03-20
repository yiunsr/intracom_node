## intracom

### live demo
* <a href="http://node.labstoo.com" target="_blank">http://node.labstoo.com</a>


### doc
* [유저생성 & 로그인 로직](./doc/users.md)
* [출퇴근 스키마 & 로직](./doc/attendances.md)


### Using Node Library
* [mongoose](http://mongoosejs.com/)
  * MongoDB 관련 라이브러리
* [passport](http://www.passportjs.org/)
  * 회원가입, 로그인, 세션 관리 라이브러리로 다양한 방식(OpenID and OAuth)의 로그인 지원
* passport-local
  * 회원가입, 로그인, 세션 관리를 직접 하게 될 때 사용함
* [passport-local-mongoose](https://github.com/saintedlama/passport-local-mongoose)
  * 회원가입, 로그인 관련 기본 코드 제공
* [moment moment-timezone](https://momentjs.com/)
  * UTC와 localtime 전환시
  * mongoDB에서는 UTC 로 저장되는데 화면에 표시할 때는 localtime(KST)로 보여줄 필요가 있다. 

### Using Library or Template
* [sufee-admin-dashboard](https://github.com/puikinsh/sufee-admin-dashboard)
  * Bootstrap Template
* https://pixabay.com/en/user-person-people-profile-account-1633249/
  * default user image(CC0 License)

### 파일로그 생성 및 daily rotation
* https://github.com/expressjs/morgan#log-file-rotation
* https://www.npmjs.com/package/rotating-file-stream
* 
```xml
var express = require('express')
var fs = require('fs')
var logger = require('morgan')
var path = require('path')
var rfs = require('rotating-file-stream')
......

  var logDirectory = config.logpath;

  // ensure log directory exists
  fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)

  // create a rotating write stream
  var accessLogStream = rfs('access.log', {
    interval: '1d', // rotate daily,
    size:     '10M', 
    path: logDirectory,
    compress: 'gzip' 
  })

  // setup the logger
  app.use(morgan('combined', {stream: accessLogStream}))

```
