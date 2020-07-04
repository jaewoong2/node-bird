const express = require('express');
const { isLoggedIn } = require('./middlewares');
const multer = require('multer');
const path = require('path')
const fs = require('fs')

const { Post, Comment, User, Image, Hashtag } = require('../models');
const router = express.Router();

try {
    fs.accessSync('uploads');
} catch (err) {
    console.log('uploads 폴더가 없으므로 생성 합니다');
    fs.mkdirSync('uploads');
}
// multer는 라우터 마다 장착한다
const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, done) {
            done(null, 'uploads');
        },
        filename(req, file, done) {
            const ext = path.extname(file.originalname); // 업로드할때 언제 업로드 한지 파일명에 붙혀주기 위해서 확장자만 추출
            const basename = path.basename(file.originalname, ext); // 노드에서 path 모듈 제공, 파일명에 확장자를 붙혀 추출해준다
            done(null, basename + '_' + new Date().getTime() + ext) // 파일명12312312.png
        },
    }),
    limits: { fileSize: 20 * 1024 * 1024 }, // 20mb
});


router.post('/', isLoggedIn, upload.none(), async (req, res, next) => { // /post
    try {
        const hashtags = req.body.content.match(/(#[^\s#]+)/g); 
        const post = await Post.create({
            content: req.body.content,
            UserId: req.user.id, // 디시리얼라이즈를 통해 req.user가 만들어져서 언제든 사용 가능
        });
        if( hashtags ) {
        const result =  await Promise.all(hashtags.map((tag) => Hashtag.findOrCreate({ 
                where : { name : tag.slice(1).toLowerCase() }
                }))); // [노드, true], [리액트, true]
                await post.addHashtags(result.map((v) => v[0]));
        }

        if(req.body.image) {
            if( Array.isArray(req.body.image)) { // 이미지를 여러개 올리면 images = [asd.png, ggr.png]
               const images = await Promise.all(req.body.image.map((image) => {
                    return Image.create({ src : image });
                }))
                await post.addImages(images);
            } else { //이미지를 하나만 올리면 image : asd.png
                const image = await Image.create({ src : req.body.image });
                await post.addImages(image)
            }
        }


        const fullPost = await Post.findOne({
            where: { id: post.id },
            include: [{
                model: Image,
            }, {
                model: Comment,
                include: [{
                    model: User,
                    attributes: ['id', 'nickname'],
                }]
            }, {
                model: User, // 게시글 작성자
                attributes: ['id', 'nickname'],
            }, {
                model: User, // 좋아요 누른 사람
                attributes: ['id'],
                as: 'Likers',
            },{  
                model : Post,
                as : 'Retweet',
                include : [{
                   model : User,
                   attributes : ['id', 'nickname']
                }],
            }]
        })
        res.status(201).json(fullPost);
    } catch (err) {
        console.error(err)
        next(err)
    }
});

router.post('/:postId/comment', isLoggedIn, async (req, res, next) => { // /post
    try {
        const post = await Post.findOne({
            where: { id: req.params.postId }
        })
        if (!post) {
            return res.status(403).send('존재하지 않는 게시글입니다.')
        }
        const comment = await Comment.create({
            content: req.body.content,
            PostId: parseInt(req.params.postId, 10),
            UserId: req.user.id,
        });
        const fullComent = await Comment.findOne({
            where: { id: comment.id },
            include: [{
                model: User,
                attributes: ['id', 'nickname'],
            }]
        })
        res.status(201).json(fullComent);
    } catch (err) {
        console.error(err)
        next(err)
    }
});

router.get('/:postId', async(req, res, next) => {
    try {
        const post = await Post.findOne({
            where : {id : req.params.postId}
        })
        if(!post) {
            return res.status(403).send('존재 하지 않는 게시물 입니다')
        }
        const postWithEeleMent = await Post.findOne({
            where : { id :  req.params.postId},
            include : [{
                model : User,
                attributes : ['id', 'nickname'],
            }, {
                model : Image,
            }, {
                model: User, // 좋아요 누른 사람
                attributes: ['id'],
                as: 'Likers',
            }, {  
                model : Post,
                as : 'Retweet',
                include : [{
                   model : User,
                   attributes : ['id', 'nickname']
                }],
            }, {
                model: Comment,
                include: [{
                    model: User,
                    attributes: ['id', 'nickname'],
                }]
            }]
        })
        res.status(201).json(postWithEeleMent)
    } catch (err) {
        console.error(err)
        next(err)
    }
}) 



router.patch('/:postId/like', isLoggedIn, async (req, res, next) => {
    try {
        const post = await Post.findOne({
            where: { id: req.params.postId }
        });
        if (!post) {
            return res.status(403).send('게시글이 존재하지 않습니니다')
        }
        await post.addLikers(req.user.id);
        res.status(200).json({ PostId: post.id, UserId: req.user.id })
    } catch (err) {
        console.error(err);
        next(error)
    }
})


router.delete('/:postId/unlike', isLoggedIn, async (req, res, next) => {
    try {
        const post = await Post.findOne({
            where: { id: req.params.postId }
        });
        if (!post) {
            return res.status(403).send('게시글이 존재하지 않습니니다')
        }
        await post.removeLikers(req.user.id);
        res.status(200).json({ PostId: post.id, UserId: req.user.id })

    } catch (err) {
        console.error(err);
        next(error)
    }
});


router.delete('/:postId', isLoggedIn, async (req, res, next) => {
    try {
        const post = await Post.findOne({
            where: { id: req.params.postId }
        });
        await Post.destroy({
            where: {
                id: req.params.postId,
                UserId: req.user.id,
            },
        });
        res.json({ PostId: parseInt(req.params.postId, 10) });
        if (!post) {
            return res.status(403).send('게시글이 존재 하지 않습니다')
        }
    } catch (err) {
        console.error(err)
        next(err)
    }
})



router.post('/images', isLoggedIn, upload.array('image'), (req, res, next) => { // image 인풋에 uplaod 해준다. 사진 1개 - single , 사진 여러개 - array, 텍스트 - json
    console.log(req.files) // 여기에 업로드한 이미지들이 있음
    res.json(req.files.map((v) => v.filename))
});

router.post('/:postId/retweet', isLoggedIn, async (req, res, next) => { // /post
    try {
        const post = await Post.findOne({
            where: { id: req.params.postId },
            include : [{
                model : Post,
                as : 'Retweet',
            }],
        })
        if (!post) {
            return res.status(403).send('존재하지 않는 게시글입니다.')
        }
        if(req.user.id === post.UserId || (post.Retweet && post.Retweet.UserId === req.user.id) ) {
            return res.status(403).send('자신의 글을 리트윗 할 수 없습니다');
        }
        const retweetTargetId = post.RetweetId || post.id;
        const exPost = await Post.findOne({
            where : {
                UserId : req.user.id,
                RetweetId : retweetTargetId,
            },
        });
        if(exPost) {
            return res.status(403).send('이미 리트윗 했습니다.');
        }
        const retweet = await Post.create({
            UserId : req.user.id,
            RetweetId : retweetTargetId,
            content : 'retweet',
        });

        const retweetWithPrevPost = await Post.findOne({
            where : { id : retweet.id },
            include : [{
                model : Post,
                 as : 'Retweet',
                 // 현재 찾은 포스트는 리트윗한 본 게시물의 ID를 RetwwetId로서 갖고 있다.
                 // 이것은 as Retweet으로서 가져 올 수 있고,
                 // id가 12번인 포스트가 11번인 포스트를 리트윗 한 것 이기 떄문에
                 // 게시물 1개에 1개의 Retweet 관계 밖에 없다.
                 // 따라서 as : 'Retweet' 으로 게시물을 가져오면 된다
                 include : [{
                    model : User,
                    attributes : ['id', 'nickname'],
                 }, {
                   model : Image
                 }]
            }, {
                model : User,
                attributes : ['id', 'nickname'],
            }, {
                model : Image
            }, {
                model : Comment,
                include : [{
                    model : User,
                    attributes : ['id', 'nickname'],
                }]
            }],
        });
        res.status(201).json(retweetWithPrevPost);
    } catch (err) {
        console.error(err)
        next(err)
    }
});


module.exports = router;