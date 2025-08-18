export default (sequelize, DataTypes) => {
    const Role = sequelize.define(
        'Role',
        {
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
        },
        {
            tableName: 'roles',
            timestamps: true,
        }
    );

    Role.associate = (models) => {

        // Many-to-many relationship with User through UserRole
        Role.belongsToMany(models.User, {
            through: models.UserRole,
            foreignKey: 'role_id',
            otherKey: 'user_id',
            as: 'users'
        });

        // One-to-many relationship with UserRole for additional data
        Role.hasMany(models.UserRole, {
            foreignKey: 'role_id',
            as: 'userRoles'
        });

        // Many-to-many relationship with Permission through RolePermission
        Role.belongsToMany(models.Permission, {
            through: models.RolePermission,
            foreignKey: 'role_id',
            otherKey: 'permission_id',
            as: 'permissions'
        });

    };

    return Role;
};
