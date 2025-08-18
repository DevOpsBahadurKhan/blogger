export default (sequelize, DataTypes) => {
  const Policy = sequelize.define(
    'Policy',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      effect: {
        type: DataTypes.ENUM('allow', 'deny'),
        allowNull: false,
        defaultValue: 'allow',
      },
      priority: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        comment: 'Higher priority policies are evaluated first',
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      resource: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Resource this policy applies to',
      },
      action: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Action this policy applies to',
      },
      possession: {
        type: DataTypes.STRING(100),
        allowNull: false,
        defaultValue: 'any',
      },
    },
    {
      tableName: 'policies',
      timestamps: true,
      indexes: [
        {
          fields: ['resource', 'action', 'possession'],
        },
        {
          fields: ['priority'],
        },
        {
          fields: ['isActive'],
        },
      ],
    }
  );

  Policy.associate = (models) => {
    // Policy has multiple conditions
    Policy.hasMany(models.PolicyCondition, {
      foreignKey: 'policy_id',
      as: 'conditions',
    });

    // Policy can be assigned to roles
    Policy.belongsToMany(models.Role, {
      through: 'role_policies',
      foreignKey: 'policy_id',
      otherKey: 'role_id',
      as: 'roles',
    });
  };

  return Policy;
};
