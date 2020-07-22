const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const config = require('./config/key');
const { auth } = require('./middleware/auth');

const { User } = require("./models/User");

//application/x-www-force-urlencoded
app.use(bodyParser.urlencoded({extended: true}));

app.use(bodyParser.json());
app.use(cookieParser());

const mongoose = require('mongoose');
// const { json } = require('body-parser');
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err))


app.get('/', (req, res) => res.send('Hello World!하이'))

app.get('/api/hello', (req, res) => {
    res.send("안녕~")
})


app.post('/api/users/register', (req, res) => {
    //회원가입할대 필요한 정보들을 client에서 가져오면
    //그것들을 데이터 베이스에 넣어준다.
    const user = new User(req.body)
    // console.log("zzzzz")
    user.save((err, doc) => {
        if(err) return res.json({ success: false, err})
        return res.status(200).json({
            success: true
        })
    })
    
})

app.post('/api/users/login', (req, res) => {
    //요청된 이메일 데이터베이스에서 있는지 찾는다 .
    User.findOne({ email: req.body.email }, (err, user) => {
        if(!user) {
            return res.json({
                loginSuccess: false,
                message: "제공된 이메일에 해당하는 유저가 없습니다."
            })
        } 
    //요청된 이메일이 데이터베이스에있다면 비밀번호가 맞는 비번인지 확인.

    user.comparePassword(req.body.password , (err, isMatch) => {
        if(!isMatch)
        return res.json({ loginSuccess: false, message : "비밀번호가 틀렸습니다."})

        
        //비밀번호까지 맞다면 토큰을 생성하기.
        user.generateToken((err, user) => {
                if(err) return res.status(400).send(err);

                //token을 저장한다 어디에? 쿠키,로컬스토리지 등등 여기서는 쿠키
                res.cookie('x_auth', user.token)
                .status(200)
                .json({ loginSuccess: true, userId: user._id })

            })
        })
    })
    //비밀번호까지 맞다면 토큰을 생성하기.
})

app.get('/api/users/auth', auth ,(req, res) => {

    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true,
        isAuth : true,
        email: req.user.email,
        lastname: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image
    })
})


app.get('/api/users/logout', auth, (req, res) => {
    User.findOneAndUpdate({ _id: req.user._id},
    { token: "" }
    , (err, user) => {
        if (err) return res.json({ success: false, err});
        return res.status(200).send({
            success: true
        })
    })
})




const port = 5000

app.listen(port, () => console.log(`Example app listening on port ${port}!`))