export default (sequelize, DataTypes) => {
  const Permission = sequelize.define(
    'Permission',
    {
      resource: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      action: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      possession: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isIn: [['own', 'any']],
        },
      },
    },
    {
      tableName: 'permissions',
      timestamps: true,
    }
  );

  Permission.associate = (models) => {
    /** @Before */
    // Permission.belongsTo(models.Role, { foreignKey: 'role_id' }); 

    /** @After */
    Permission.belongsToMany(models.Role, {
      through: 'role_permissions',
      foreignKey: 'permission_id',
    });
  };

  return Permission;
};
