import db from '../models/index.js';
const { Permission } = db;

class PermissionRepository {


    async create(data) {
        return await Permission.create(data);
    }
}

export default new PermissionRepository();
