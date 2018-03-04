## 유저 생성 & 로그인 로직


### 로그인 관련 사용 라이브러리
*[passport-local-mongoose](https://github.com/saintedlama/passport-local-mongoose)
  * 회원가입, 로그인 관련 기본 코드 제공

### 회원정보
 * passport-local-mongoose 가 기본적으로 제공하는 username 과 password
 * email (username 과 email 을 통합할 수도 있는데 복잡해서 우선 중복해서 사용하고 있음)
 * usertype : admin 과 user 가 있다. admin 의 경우 admin 접속 가능하다.
 * lastlogin : 마지막으로 로그인한 시간(UTC)

### 퍼미션 확인을 위한 함수
 * utils.js 에 isAuthenticated, isAdmin 함수로 로그인 상태와 admin 인지 검사한다.


### 패스워드 변경
 * UserSchema 에 자동적으로 changePassword 함수가 사용할 수 있기 때문에 이 함수를 이용한다. 
 