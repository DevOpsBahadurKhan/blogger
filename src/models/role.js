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
        Role.hasMany(models.Permission, { foreignKey: 'role_id' });
        Role.hasMany(models.User, { foreignKey: 'role_id', as: 'users' });
    };

    return Role;
};
