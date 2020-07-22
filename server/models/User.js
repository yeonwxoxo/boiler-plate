const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    name: {
        type : String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true,
        unique: 1
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role : {
        type: Number,
        default: 0
    },
    image: String,
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }
})

userSchema.pre('save', function( next ) {
    var user = this;

    if(user.isModified('password')) {
    //비밀번호를 암호화 시킴.bcrypt
        bcrypt.genSalt(saltRounds, function(err, salt) {
            if (err) return next(err)

            bcrypt.hash(user.password, salt, function(err, hash) {
                if(err) return next(err);
                user.password = hash
                next()
                // Store hash in your password DB.
                })
            })
        } else {
            next()
    }
});

userSchema.methods.comparePassword = function(plainPassword, cb) {
    //plainPassword : 1234567
    //암호화된 비번 : $2b$10$FZOy2RPrEYfGEN/xutGTlufxMynQ18nRQtq.RbClkj4qr14BPbK36
    bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
        if(err) return cb(err);
        cb(null, isMatch);
    });
};

userSchema.methods.generateToken = function(cb) {

    var user = this;
    //jsonwebtoken 이용해서 token을 생성하기
    
    var token = jwt.sign(user._id.toHexString(), 'secretToken')
    // user._id + 'secretToken' = token
    user.token = token
    user.save(function(err, user) {
        if(err) return cb(err)
        cb(null, user);
    })
}

userSchema.statics.findByToken = function (token, cb) {
    var user = this;

    //토큰을 decode한다
    jwt.verify(token, 'secretToken', function(err,decoded){
        //유저아이디 이용해서 유저 찾은다음
        //클라이언트에서 가져온 토큰과 디비에 보관된 토큰 일치하는지확인

        user.findOne({"_id": decoded, "token": token}, function(err, user){

            if(err) return cb(err);
            cb(null, user)
        })
    })
}


const User = mongoose.model('User', userSchema);

module.exports = { User }