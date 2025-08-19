export default (sequelize, DataTypes) => {
  const ResourceAttribute = sequelize.define(
    'ResourceAttribute',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      resource_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Name of the resource type (e.g., "post", "user")',
      },
      resource_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'ID of the specific resource instance',
      },
      attribute_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'attributes',
          key: 'id',
        },
      },
      value: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: 'Additional metadata for the attribute value',
      },
    },
    {
      tableName: 'resource_attributes',
      timestamps: true,
      underscored: true,
      indexes: [
        {
          unique: true,
          fields: ['resource_name', 'resource_id', 'attribute_id'],
        },
        {
          fields: ['resource_name', 'resource_id'],
        },
      ],
    }
  );

  ResourceAttribute.associate = (models) => {
    // ResourceAttribute belongs to an Attribute
    ResourceAttribute.belongsTo(models.Attribute, {
      foreignKey: 'attribute_id',
      as: 'attribute',
    });
  };

  return ResourceAttribute;
};
