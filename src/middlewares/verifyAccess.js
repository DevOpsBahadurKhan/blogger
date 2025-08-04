// /src/middlewares/verifyAccess.js

module.exports = function verifyAccess(action, resource, possession = 'any') {
    return (req, res, next) => {
        try {
            const role = req.user?.role;
            if (!role) return res.status(403).json({ message: 'Missing role' });

            const methodName = `${action}${capitalize(possession)}`;
            const permission = global.ac.can(role)[methodName](resource);

            if (!permission.granted) {
                return res.status(403).json({ message: 'Access Denied' });
            }

            req.permission = permission;
            next();
        } catch (err) {
            console.error('[AccessControl Error]', err.message);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    };
};
