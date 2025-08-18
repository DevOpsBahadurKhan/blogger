export default (sequelize, DataTypes) => {
  const PolicyCondition = sequelize.define(
    'PolicyCondition',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      policy_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'policies',
          key: 'id',
        },
      },
      attribute_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'attributes',
          key: 'id',
        },
      },
      operator: {
        type: DataTypes.ENUM('=', '!=', '>', '<', '>=', '<=', 'in', 'contains', 'regex'),
        allowNull: false,
        defaultValue: '=',
      },
      value: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Value to compare against',
      },
      applies_to: {
        type: DataTypes.ENUM('user', 'resource', 'time', 'env'),
        allowNull: false,
        defaultValue: 'user',
        comment: 'What entity this condition applies to',
      },
      logical_operator: {
        type: DataTypes.ENUM('AND', 'OR'),
        allowNull: true,
        defaultValue: 'AND',
        comment: 'Logical operator for combining with next condition',
      },
      order: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        comment: 'Order of evaluation within the policy',
      },
    },
    {
      tableName: 'policy_conditions',
      timestamps: true,
      indexes: [
        {
          fields: ['policy_id', 'order'],
        },
        {
          fields: ['attribute_id'],
        },
      ],
    }
  );

  PolicyCondition.associate = (models) => {
    // PolicyCondition belongs to a Policy
    PolicyCondition.belongsTo(models.Policy, {
      foreignKey: 'policy_id',
      as: 'policy',
    });

    // PolicyCondition references an Attribute
    PolicyCondition.belongsTo(models.Attribute, {
      foreignKey: 'attribute_id',
      as: 'attribute',
    });
  };

  return PolicyCondition;
};
