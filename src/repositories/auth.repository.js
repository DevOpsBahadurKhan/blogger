import db from '../models/index.js';
const { User, Role, UserRole } = db;

class AuthRepository {

    async findByEmail(email) {
        try {
            console.log(`[AuthRepo] Looking for user with email: ${email}`);
            const user = await User.findOne({ 
                where: { email },
                include: {
                    model: Role,
                    as: 'roles',
                    attributes: ['name']
                }
            });
            console.log(`[AuthRepo] User found:`, user ? `ID: ${user.id}, Email: ${user.email}` : 'None');
            return user;
        } catch (error) {
            console.error(`[AuthRepo] Error finding user by email:`, error.message);
            throw error;
        }
    }

    async updateRefreshToken(userId, token) {
        await User.update(
            { refreshToken: token },
            { where: { id: userId } }
        );
        return await User.findByPk(userId); // Return updated user
    }

    async register(data) {
        // Create the user
        const user = await User.create(data);
        
        // Find the default "reader" role
        const readerRole = await Role.findOne({ where: { name: 'reader' } });
        
        if (readerRole) {
            // Assign the reader role to the new user
            await UserRole.create({
                user_id: user.id,
                role_id: readerRole.id,
                assigned_by: null,
                assigned_at: new Date(),
                expires_at: null,
                is_active: true
            });
        }
        
        // Return user with roles included
        return await User.findByPk(user.id, {
            include: {
                model: Role,
                as: 'roles',
                attributes: ['name']
            }
        });
    }
}

export default new AuthRepository();
