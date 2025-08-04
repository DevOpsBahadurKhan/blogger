const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../config/db.config');

const db = {};

// Register models with both `sequelize` and `DataTypes`
db.User = require('./user.model')(sequelize, DataTypes);
db.Post = require('./post.model')(sequelize, DataTypes);
db.Comment = require('./comment.model')(sequelize, DataTypes);
db.Role = require('./role')(sequelize, DataTypes);
db.Permission = require('./permission')(sequelize, DataTypes);

// Setup relationships (if defined inside associate methods)
Object.values(db).forEach((model) => {
    if (model.associate) {
        model.associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
