// models/userRole.js
export default (sequelize, DataTypes) => {
    const UserRole = sequelize.define(
        'UserRole',
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id'
                }
            },
            role_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'roles',
                    key: 'id'
                }
            },
            assigned_by: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: 'users',
                    key: 'id'
                }
            },
            assigned_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW
            },
            expires_at: {
                type: DataTypes.DATE,
                allowNull: true
            },
            is_active: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true
            }
        },
        {
            tableName: 'user_roles',
            timestamps: true,
            underscored: true,
            indexes: [
                {
                    unique: true,
                    fields: ['user_id', 'role_id']
                },
                {
                    fields: ['user_id']
                },
                {
                    fields: ['role_id']
                },
                {
                    fields: ['is_active']
                }
            ]
        }
    );

    return UserRole;
};
