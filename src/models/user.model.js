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
            // Removed role_id - now using many-to-many through UserRole
        },
        {
            tableName: 'users',
            timestamps: true,
            underscored: true,
            hooks: {
                beforeSave: async (user) => {
                    if (user.changed('password')) {
                        user.password = await bcrypt.hash(user.password, 10);
                    }
                },
            },
        }
    );

    // Instance method for password validation
    User.prototype.validPassword = async function (candidatePassword) {
        return bcrypt.compare(candidatePassword, this.password);
    };

    // Associations
    User.associate = (models) => {
        // Many-to-many relationship with Role through UserRole
        User.belongsToMany(models.Role, {
            through: models.UserRole,
            foreignKey: 'user_id',
            otherKey: 'role_id',
            as: 'roles'
        });

        // One-to-many relationship with UserRole for additional data
        User.hasMany(models.UserRole, {
            foreignKey: 'user_id',
            as: 'userRoles'
        });

        // One-to-many relationship with Post
        User.hasMany(models.Post, {
            foreignKey: 'user_id',
            as: 'posts'
        });

        // One-to-many relationship with Comment
        User.hasMany(models.Comment, {
            foreignKey: 'user_id',
            as: 'comments'
        });
    };

    return User;
};
