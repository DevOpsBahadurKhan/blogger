// models/rolePermission.js
export default (sequelize, DataTypes) => {
    const RolePermission = sequelize.define(
        'RolePermission',
        {},
        {
            tableName: 'role_permissions', 
            timestamps: true,
            underscored: true,
            indexes: [
                {
                    unique: true,
                    fields: ['role_id', 'permission_id'], // prevent duplicates
                },
            ],
        }
    );

    return RolePermission;
};
