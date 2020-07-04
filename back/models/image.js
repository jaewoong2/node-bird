module.exports = (sequelize, DataTypes) => {
    const Image = sequelize.define('Image', { //users로 mySQL 로 저장됨(테이블)
       //id가 기본적으로 들어있다.
        src : {
            type : DataTypes.STRING(100),
            allowNull : false,
        },
    }, 
    {
        charset : 'utf8',
        collate : 'utf8_general_ci'
    });
    Image.associate = (db) => {
        db.Image.belongsTo(db.Post);
    };
    return Image;
}