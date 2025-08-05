export default (sequelize, DataTypes) => {
    const Post = sequelize.define(
        'Post',
        {
            title: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            content: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
        },
        {
            tableName: 'posts',
            timestamps: true,
            underscored: true,
        }
    );

    Post.associate = (models) => {
        Post.belongsTo(models.User, { foreignKey: 'user_id' });
        Post.hasMany(models.Comment, { foreignKey: 'post_id' });
    };

    return Post;
};
