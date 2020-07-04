const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport')
const { User, Post, Hashtag, Image, Comment } = require('../models');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const router = express.Router();
const { Op } = require('sequelize')



router.get('/:hashtag', async (req , res,next) => { // get hashtag/3123?lastId=asd
    try {
        const where = {};
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
                model : Hashtag,
                where : { name : decodeURIComponent(req.params.hashtag) }
            }, {
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

module.exports = router;
