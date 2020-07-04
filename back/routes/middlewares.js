exports.isLoggedIn = (req, res, next) => { //로그인을 했는지 
    if (req.isAuthenticated()) { //pasport에서 제공
        next();  //로그인을 했으면 넘어간다
    } else {
        res.status(401).send('로그인이 필요합니다.'); //로그인을 안했으면
   }
};

exports.isNotLoggedIn = (req, res, next) => { //로그인했는지
    if (!req.isAuthenticated()) { //pasport에서 제공
        next();  //로그인을 안했으면 넘어간다
    } else { //로그인 했으면
        res.status(401).send('로그인하지 않은 사용자만 접근 가능합니다.');
    }
};