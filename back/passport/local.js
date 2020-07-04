const poassport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const { User } = require('../models');
const bcrypt = require('bcrypt');

module.exports = () => {
    poassport.use(new LocalStrategy({
        usernameField: 'email',     // 우리가 받을 때 req.body.email 이라서 eamil 로 이름을 정해준것이다/
        passwordField: 'password' // 우리가 받을 때 req.body.password 이기때문에 password 로 이름을 정해준것
    }, async (email, password, done) => {
        try {
            const user = await User.findOne({
                where: { email }
            });

            if (!user) {
                return done(null, false, { reason: '존재하지 않는 이메일 입니다' })
                //  서버에러, 성공여부, client 에러
            }
            const result = await bcrypt.compare(password, user.password)
            if (result) {
                return done(null, user);
            }
            return done(null, false, { reason: '비밀번호가 틀렸습니다.' });
        } catch (err) {
            console.error(err)
            return done(err)
        }
    }));
}