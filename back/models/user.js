module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', { //users로 mySQL 로 저장됨(테이블)
       //id가 기본적으로 들어있다.
        email : {
            type : DataTypes.STRING(30), //STRING TEXT BOLLEAN INTGER FLOAT DATETIME
            allowNull : false, // 필수
            unique : true, //중복방지
        },
        nickname : {
            type : DataTypes.STRING(30),
            allowNull : false, // 필수
        },
        password : {
            type : DataTypes.STRING(100),
            allowNull : false,
        },
    }, 
    {
        charset : 'utf8',
        collate : 'utf8_general_ci'
    });
    User.associate = (db) => {
        db.User.hasMany(db.Post);
        db.User.hasMany(db.Comment);
        db.User.belongsToMany(db.Post ,{ through : 'Like', as : 'Liked' });// 햇갈리는걸 막기위해
        db.User.belongsToMany(db.User, { through : 'Follow', as : 'Followers', foreignKey : 'FollowingId'  })
        db.User.belongsToMany(db.User, { through : 'Follow', as : 'Followings', foreignKey : 'FollowerId'  })
   
    };
    return User;
}