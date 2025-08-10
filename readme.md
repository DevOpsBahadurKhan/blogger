
# Basic Boilerplate : MVC + Rep and Svc

# Client → Route → Controller → Service → Repository → Model → DB

# UPDATE users SET role_id = 1 WHERE email = 'shifa@gmail.com';



# Find the record in role_permissions
SELECT * FROM role_permissions WHERE role_id = 3 AND permission_id = 2;

# Which role got the permission
# What that permission actually does (resource + action + possession)

SELECT r.name AS role_name, p.resource, p.action, p.possession
FROM role_permissions rp
JOIN roles r ON rp.role_id = r.id
JOIN permissions p ON rp.permission_id = p.id
WHERE rp.role_id = 3
  AND rp.permission_id = 2;


# Check all permissions for a given role
SELECT p.id, p.resource, p.action, p.possession
FROM role_permissions rp
JOIN permissions p ON rp.permission_id = p.id
WHERE rp.role_id = 3;
