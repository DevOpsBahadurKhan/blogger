export default (sequelize, DataTypes) => {
    const Comment = sequelize.define(
        'Comment',
        {
            content: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
        },
        {
            tableName: 'comments',
            timestamps: true,
            underscored: true,
        }
    );

    Comment.associate = (models) => {
        Comment.belongsTo(models.User, { 
            foreignKey: 'user_id',
            as: 'User'
        });
        Comment.belongsTo(models.Post, { 
            foreignKey: 'post_id',
            as: 'Post'
        });
    };

    return Comment;
};
