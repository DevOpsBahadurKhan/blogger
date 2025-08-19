import { DataTypes } from 'sequelize';

export default function defineProfile(sequelize) {
  const Profile = sequelize.define('Profile', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'user_id',
    },
    firstName: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'first_name',
    },
    lastName: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'last_name',
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    dateOfBirth: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'date_of_birth',
    },
    location: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
  }, {
    tableName: 'profiles',
    timestamps: true,
    underscored: true,
  });

  Profile.associate = function(models) {
    Profile.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
    });
  };

  return Profile;
}
