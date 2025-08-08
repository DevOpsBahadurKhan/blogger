import { Sequelize, DataTypes } from 'sequelize';
import { sequelize } from '../config/db.config.js';

// Import model definition functions
import defineUser from './user.model.js';
import definePost from './post.model.js';
import defineComment from './comment.model.js';
import defineRole from './role.model.js';
import definePermission from './permission.model.js';
import defineRolePermission from './rolePermission.model.js';

const db = {};

// Initialize models
db.User = defineUser(sequelize, DataTypes);
db.Post = definePost(sequelize, DataTypes);
db.Comment = defineComment(sequelize, DataTypes);
db.Role = defineRole(sequelize, DataTypes);
db.Permission = definePermission(sequelize, DataTypes);
db.RolePermission = defineRolePermission(sequelize, DataTypes);

// Run associations
Object.values(db).forEach((model) => {
    if (model.associate) {
        model.associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
