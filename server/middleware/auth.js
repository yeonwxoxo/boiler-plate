const { User } = require("../models/User");


let auth = (req, res, next) => {
    //인증처리 하는 곳
    // 클라이언트 쿠키에서 토큰을 가져온다
    let token = req.cookies.x_auth;

    //토큰을 복호화 한 후 유저를 찾는 다
    User.findByToken(token, (err, user) => {
        if(err) throw err;
        if(!user) return res.json({ isAuth: false, error:true })

        req.token = token;
        req.user = user;
        next();
    })

    //유저 있으면 인증 ㅇㅋ

    //유저 없으면 인증 ㄴㄴ
    
}

module.exports = { auth }; 