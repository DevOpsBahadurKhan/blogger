export default (sequelize, DataTypes) => {
  const UserAttribute = sequelize.define(
    'UserAttribute',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
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
      tableName: 'user_attributes',
      timestamps: true,
      underscored: true,
      indexes: [
        {
          unique: true,
          fields: ['user_id', 'attribute_id'],
        },
      ],
    }
  );

  UserAttribute.associate = (models) => {
    // UserAttribute belongs to a User
    UserAttribute.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
    });

    // UserAttribute belongs to an Attribute
    UserAttribute.belongsTo(models.Attribute, {
      foreignKey: 'attribute_id',
      as: 'attribute',
    });
  };

  return UserAttribute;
};
