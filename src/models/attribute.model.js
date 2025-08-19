export default (sequelize, DataTypes) => {
  const Attribute = sequelize.define(
    'Attribute',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(120),
        allowNull: false,
        unique: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      dataType: {
        type: DataTypes.ENUM('string', 'number', 'boolean', 'date', 'array'),
        allowNull: false,
        defaultValue: 'string',
      },
      isSystem: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      tableName: 'attributes',
      timestamps: true,
      underscored: true,
    }
  );

  Attribute.associate = (models) => {
    // Attribute can be used by multiple users
    Attribute.hasMany(models.UserAttribute, {
      foreignKey: 'attribute_id',
      as: 'userValues',
    });

    // Attribute can be used by multiple resources
    Attribute.hasMany(models.ResourceAttribute, {
      foreignKey: 'attribute_id',
      as: 'resourceValues',
    });

    // Attribute can be used in policy conditions
    Attribute.hasMany(models.PolicyCondition, {
      foreignKey: 'attribute_id',
      as: 'policyConditions',
    });
  };

  return Attribute;
};
