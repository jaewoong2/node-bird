module.exports = (sequelize, DataTypes) => {
    const Hashtag = sequelize.define('Hashtag', { //users로 mySQL 로 저장됨(테이블)
       //id가 기본적으로 들어있다.
        name : {
            type : DataTypes.STRING(20),
            allowNull : false,
        },
    }, 
    {
        charset : 'utf8mb4',
        collate : 'utf8mb4_general_ci'
    });
    Hashtag.associate = (db) => {
        db.Hashtag.belongsToMany(db.Post, { through: 'PostHashtag' });
    };
    return Hashtag;
}