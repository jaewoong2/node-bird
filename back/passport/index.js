const passport = require('passport');;
const local = require('./local');
const { User } = require('../models');


module.exports = () => {
    passport.serializeUser((user, done) => { // req.login(user) 하면 여기로 먼저온다
        done(null, user.id);  // user정보에서 id만 저장함(세션에)
    });


    passport.deserializeUser( async (id, done) => {
        try {
            const user = await User.findOne({
                where : { id : id }
            });
            done(null, user)
        } catch(error) {
            console.error(error);
            done(error)
        }
    });


    local();

}

