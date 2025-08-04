const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        username: {
            type: DataTypes.STRING(50),
            allowNull: false,
            validate: {
                len: [3, 50]
            }
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        role: {
            type: DataTypes.ENUM('admin', 'author', 'reader'),
            defaultValue: 'reader'
        }
    }, {
        tableName: 'users',
        timestamps: true,
        underscored: true,

        // Hook for password hashing
        hooks: {
            beforeSave: async (user, options) => {
                if (user.changed('password')) {
                    const salt = await bcrypt.genSalt(10);
                    user.password = await bcrypt.hash(user.password, salt);
                }
            }
        }
    });

    // Instance method for comparing passwords
    User.prototype.validPassword = async function (candidatePassword) {
        return await bcrypt.compare(candidatePassword, this.password);
    };

    // Relationships
    User.associate = (models) => {
        User.hasMany(models.Post, { foreignKey: 'user_id', as: 'posts' });
        User.hasMany(models.Comment, { foreignKey: 'user_id', as: 'comments' });
    };

    return User;
};
