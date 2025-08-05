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
        Comment.belongsTo(models.User, { foreignKey: 'userId' });
        Comment.belongsTo(models.Post, { foreignKey: 'postId' });
    };

    return Comment;
};
