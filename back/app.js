const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const postRouter = require('./routes/post');
const postsRouter = require('./routes/posts');
const userRouter = require('./routes/user');
const hashtagRouter = require('./routes/hashtag')
const db = require('./models');
const passportConfig = require('./passport');
const session = require('express-session');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

const PORT = 3065;
const app = express();
dotenv.config();

app.use(morgan('dev'));
db.sequelize.sync({
  // force : true
})
  .then(() => {
    console.log('db 연결 성공');
  })
  .catch(console.error);
passportConfig();


app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true, // 쿠키를 같이보내준다.
  }));

app.use('/', express.static(path.join(__dirname, 'uploads'))) // 경로 지정
app.use(express.json()); // 요청받은 데이터 를 받기 위함 ( data를 req.body로 받기 위함)
app.use(express.urlencoded({extended : true})); // 요청받은 데이터 를 받기 위함 ( data를 req.body로 받기 위함)
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
  saveUninitialized : false,
  resave : false,
  secret : process.env.COOKIE_SECRET,
}
));
app.use(passport.initialize()); //PASPORT 사용
app.use(passport.session());

// 미들웨어설정

app.use('/post', postRouter)
app.use('/posts', postsRouter)
app.use('/user', userRouter)
app.use('/hashtag', hashtagRouter)


app.listen(PORT, () => {
    console.log(`${PORT}서버 실행중`)
})