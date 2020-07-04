const express = require('express');
const { User, Image, Post, Comment } = require('../models');
const { Op } = require('sequelize')

const router = express.Router();

router.get('/', async (req , res,next) => {
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