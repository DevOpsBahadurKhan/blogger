// models/permission.js

module.exports = (sequelize, DataTypes) => {
  const Permission = sequelize.define('Permission', {
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
      }
    },
  }, {
    tableName: 'permissions',
    timestamps: false,
  });

  Permission.associate = (models) => {
    Permission.belongsTo(models.Role, { foreignKey: 'role_id' });
  };

  return Permission;
};
