const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport')
const { User, Post, Image, Comment } = require('../models');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const router = express.Router();

router.get('/', async (req, res, next) => {
    try {
        if (req.user) { 
            const fullUserWithOurPassword = await User.findOne({
                where: { id: req.user.id },
                attributes: {
                    exclude: ['password'],
                },
                include: [{
                    model: Post,
                    attributes: ['id'],
                }, {
                    model: User,
                    as: 'Followings',
                    attributes: ['id'],
                }, {
                    model: User,
                    as: 'Followers',
                    attributes: ['id'],
                }]
            });
            return res.status(200).json(fullUserWithOurPassword)
        } else {
            res.status(200).json(null)
        }
    } catch (err) {
        console.error(err);
        next(err);
    }
})


router.post('/', isNotLoggedIn, async (req, res, next) => { // POST /user/
    try {
        const exUser = await User.findOne({
            where: { // 조건 
                email: req.body.email, // 원래 사용자 안에 같은 이메일이 있냐
            }
        });
        if (exUser) {
            return res.status(403).send('이미 사용중인 아이디 입니다.');
            // 응답은 무조건 한번만
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 8); // 뒤에 숫자는 hash화
        // bcrypt 는 비동기
        await User.create({
            email: req.body.email, // data를 req.body로 받는다
            nickname: req.body.nickname,
            password: hashedPassword,
        });
        // res.setHeader('Access-Control-Allow-Origin', 'http:localhost:3000')
        res.status(201).send('ok');
    } catch (err) {
        console.log(err);
        next(error); // 에러를 한번에 처리 status(500)
    }
});

router.post('/login', isNotLoggedIn, (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            console.error(err)
            return next(err)
        }
        if (info) {
            return res.status(401).send(info.reason);
        }
        return req.login(user, async (loginErr) => { //passport 로그인
            if (loginErr) {
                return next(loginErr);
            }
            const fullUserWithOurPassword = await User.findOne({
                where: { id: user.id },
                attributes: {
                    exclude: ['password'],
                },
                include: [{
                    model: Post,
                }, {
                    model: User,
                    as: 'Followings',
                }, {
                    model: User,
                    as: 'Followers'
                }]
            });
            return res.status(200).json(fullUserWithOurPassword)
        });
    })(req, res, next); // passport에서 req res를 사용하기위해서
});

router.post('/logout', isLoggedIn, (req, res) => {
    req.logout();
    req.session.destroy();
    res.send('ok');
});

router.patch('/nickname', isLoggedIn, async (req, res, next) => {
    try {
        await User.update({
            nickname: req.body.nickname,
        }, {
            where: { id: req.user.id }  //req.user 는 현재 req.login() 된 user이다.
        });
        res.status(200).json({ nickname: req.body.nickname })
    } catch (err) {
        console.error(err)
        next(error)
    }
});

router.patch('/:userId/follow', isLoggedIn, async (req, res, next) => {
    try {
        const user = await User.findOne({ where: { id: req.params.userId } },{attributes :{  exclude : ['password']  }});
        if (!user) {
            return res.status(403).send('존재하지 않는 유저 입니다');
        }
        await user.addFollowers(req.user.id)
        res.status(200).json({ UserId: parseInt(req.params.userId, 10) })
    } catch (err) {
        console.error(err)
        next(err)
    }
})

router.delete('/:userId/follow', isLoggedIn, async (req, res, next) => {
    try {
        const user = await User.findOne({ where: { id: req.params.userId } },{attributes :{  exclude : ['password']  }});
        if (!user) {
            return res.status(403).send('존재하지 않는 유저 입니다');
        }
        await user.removeFollowers(req.user.id)
        res.status(200).json({ UserId: parseInt(req.params.userId, 10) })
    } catch (err) {
        console.error(err)
        next(err)
    }
});


router.get('/followers', isLoggedIn, async (req, res, next) => {
    try {
        const user = await User.findOne({ where: { id: req.user.id } });
        if (!user) {
            return res.status(403).send('존재하지 않는 유저 입니다');
        }
        const followers = await user.getFollowers({
            limit : parseInt(req.query.limit, 10),
        });
        res.status(200).json(followers)
    } catch (err) {
        console.error(err)
        next(err)
    }
});

router.get('/followings', isLoggedIn, async (req, res, next) => {
    try {
        const user = await User.findOne({ where: { id: req.user.id } });
        if (!user) {
            return res.status(403).send('존재하지 않는 유저 입니다');
        }
        const followings = await user.getFollowings({
            limit : parseInt(req.query.limit, 10),
        });
        res.status(200).json(followings)
    } catch (err) {
        console.error(err)
        next(err)
    }
});


router.delete('/follower/:userId', isLoggedIn, async (req, res, next) => {
    try {
        const user = await User.findOne({ where: { id: req.params.userId } });
        if (!user) {
            return res.status(403).send('존재하지 않는 유저 입니다');
        }
        await user.removeFollowings(req.user.id);
        const followers = await req.user.getFollowers();
        res.status(200).json(followers)
    } catch (err) {
        console.error(err)
        next(err)
    }
});

router.get('/:userId/posts', async (req , res,next) => {
    try {
        const where = { UserId : req.params.userId  };
        if(parseInt(req.query.lastId, 10)) { //초기 로딩이 아닐때 ,
            where.id ={ [Op.lt] : parseInt(req.query.lastId, 10)} // 보다작은 [Op.lt]
            // where : {id : 9,8,7,6,5,4,3,2,1}
        }
        const posts = await Post.findAll({
            where,
            // where = { id : {[Op.lt] : parseInt(req.query.lastId, 10)}}
            limit : 10, //10개만 가져와라
            order : [['createdAt', 'DESC']], //ASC는 정순 , DESC는 역순
            include : [{
                model : User,
                attributes : ['id', 'nickname'],
            }, {
                model : Image,
            }, {
                model : Comment,
                include : [{
                    model : User,
                    attributes : ['id', 'nickname'],
                    order : [['createdAt', 'DESC']], //ASC는 정순 , DESC는 역순
                }]        
            }, {
                model : User,
                attributes : ['id'],
                as :  'Likers'
            }, {
                model : Post,
                as : 'Retweet',
                include : [{
                    model : User,
                    attributes : ['id', 'nickname']
                },{
                    model : Image
                  }]
            }
        ]
        });
        res.status(200).json(posts)
    } catch(err) {
        console.error(err)
        next(err)
    }
})

router.get('/:userId', async (req, res, next) => {
    try {
            const fullUserWithOurPassword = await User.findOne({
                where: { id: req.params.userId },
                attributes: {
                    exclude: ['password'],
                },
                include: [{
                    model: Post,
                    attributes: ['id'],
                }, {
                    model: User,
                    as: 'Followings',
                    attributes: ['id'],
                }, {
                    model: User,
                    as: 'Followers',
                    attributes: ['id'],
                }]
            });
            if(fullUserWithOurPassword) {
                const data = fullUserWithOurPassword.toJSON();
                data.Posts = fullUserWithOurPassword.Posts.length
                data.Followings = fullUserWithOurPassword.Followings.length
                data.Followers = fullUserWithOurPassword.Followers.length
                res.status(200).json(data)
            } else {
                return res.status(200).json('존재하지 않는 사용자')
            }
    } catch (err) {
        console.error(err);
        next(err);
    }
})




module.exports = router;
