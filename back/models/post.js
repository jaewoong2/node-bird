module.exports = (sequelize, DataTypes) => {
    const Post = sequelize.define('Post', { //users로 mySQL 로 저장됨(테이블)
       //id가 기본적으로 들어있다.
        content : {
            type : DataTypes.TEXT,
            allowNull : false,
        },
    }, 
    {
        charset : 'utf8mb4',
        collate : 'utf8mb4_general_ci' // 이모티콘 가능
    });
    Post.associate = (db) => {
        db.Post.belongsTo(db.User); // add , get , set 등을 제공한다
        db.Post.belongsToMany(db.Hashtag, { through: 'PostHashtag' });
        db.Post.hasMany(db.Comment); // addComments, getCommetns, setComments
        db.Post.hasMany(db.Image); // post.addImages
        db.Post.belongsToMany(db.User, {through : 'Like', as: 'Likers'}) 
        // 중간테이블의 이름을 정해줬으면 둘다 설정해줘야한다
        // post.addLikers, post.removeLikers
        db.Post.belongsTo(db.Post, { as: 'Retweet' }) // RetweetId가 따로 생김
                     // as를 함으로써 구별 가능 post.addRetweet (단수,복수)
    };
    return Post;
}