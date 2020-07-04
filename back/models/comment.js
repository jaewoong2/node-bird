module.exports = (sequelize, DataTypes) => {
    const Comment = sequelize.define('Comment', { //users로 mySQL 로 저장됨(테이블)
       //id가 기본적으로 들어있다.
      content : {
        type : DataTypes.TEXT,
        allowNull : false,
      },
      // UserId: belongsTo를 하면 칼럼이생긴다
      // PostId: belongsTo를 하면 칼럼이생긴다
    },
    {
        charset : 'utf8mb4',
        collate : 'utf8mb4_general_ci'
    });
    Comment.associate = (db) => {
      db.Comment.belongsTo(db.User);
      db.Comment.belongsTo(db.Post);

  
    };
    return Comment;
}