import bcrypt from 'bcrypt';

export default (sequelize, DataTypes) => {
    const User = sequelize.define(
        'User',
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            username: {
                type: DataTypes.STRING(50),
                allowNull: false,
                validate: {
                    len: [3, 50],
                },
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
                validate: {
                    isEmail: true,
                },
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            role_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 3,
                references: {
                    model: 'roles',
                    key: 'id',
                },
            },
        },
        {
            tableName: 'users',
            timestamps: true,
            underscored: true,
            hooks: {
                beforeSave: async (user) => {
                    if (user.changed('password')) {
                        const salt = await bcrypt.genSalt(10);
                        user.password = await bcrypt.hash(user.password, salt);
                    }
                },
            },
        }
    );

    // Instance method for password validation
    User.prototype.validPassword = async function (candidatePassword) {
        return await bcrypt.compare(candidatePassword, this.password);
    };

    // Associations
    User.associate = (models) => {
        User.belongsTo(models.Role, { foreignKey: 'role_id', as: 'role' });
        User.hasMany(models.Post, { foreignKey: 'user_id', as: 'posts' });
        User.hasMany(models.Comment, { foreignKey: 'user_id', as: 'comments' });
    };

    return User;
};
