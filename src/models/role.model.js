export default (sequelize, DataTypes) => {
    const Role = sequelize.define(
        'Role',
        {
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
        },
        {
            tableName: 'roles',
            timestamps: true,
        }
    );

    Role.associate = (models) => {

        Role.hasMany(models.User, { foreignKey: 'role_id', as: 'users' });

        Role.belongsToMany(models.Permission, {
            through: models.RolePermission,
            foreignKey: 'role_id',
        });

    };

    return Role;
};
