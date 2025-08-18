# BlogBuddy ABAC Testing Guide

This guide provides step-by-step instructions for testing the ABAC (Attribute-Based Access Control) system in BlogBuddy using the provided Postman collection.

## 🚀 Quick Start

1. **Import the Postman Collection**: `BlogBuddy_ABAC_Testing.postman_collection.json`
2. **Set Environment Variables**: 
   - `baseUrl`: `http://localhost:3000`
   - `authToken`: Will be auto-populated after login
   - `userId`: Will be auto-populated after login
3. **Start the Server**: `npm run dev`
4. **Run Seeders**: `npm run seed`

## 📋 Testing Flow

### 1. 🔐 Authentication Testing
- **Login User**: Authenticate to get JWT token
- **Register User**: Create new user account

### 2. 👥 User Management Testing
- **Get All Users**: Retrieve all users
- **Get User Profile**: Get specific user details
- **Update User Profile**: Modify user information
- **Delete User**: Remove user account
- **Get User Role**: Check user's current role
- **Get User Permissions**: View user's permissions

### 3. 🎭 Role Management Testing
- **Create Role**: Add new role
- **Get All Roles**: List all roles
- **Get Role by ID**: Get specific role details
- **Update Role**: Modify role information
- **Delete Role**: Remove role
- **Get Role Permissions**: View permissions for a role
- **Get Role Users**: See users assigned to a role

### 4. 🔑 Permission Management Testing
- **Create Permission**: Add new permission
- **Get All Permissions**: List all permissions
- **Get Permission by ID**: Get specific permission details
- **Update Permission**: Modify permission information
- **Delete Permission**: Remove permission
- **Get Permissions by Resource**: Filter permissions by resource
- **Get Permissions by Action**: Filter permissions by action

### 5. 👥 User-Role Management Testing
- **Assign Role to User**: Give user a specific role
- **Remove Role from User**: Take away user's role
- **Get User Roles**: View all roles assigned to user
- **Get User Roles with Permissions**: See user's roles and their permissions
- **Get Role Users**: View all users with a specific role
- **Update User Role**: Modify user-role relationship
- **Deactivate User Role**: Temporarily disable user's role
- **Activate User Role**: Re-enable user's role
- **Bulk Assign Roles**: Assign multiple roles at once
- **Bulk Remove Roles**: Remove multiple roles at once
- **Check if User Has Role**: Verify user's role assignment

### 6. 📝 Blog Posts Testing
- **Create Post**: Add new blog post
- **Get All Posts**: List all posts
- **Get Post by ID**: Get specific post details
- **Update Post**: Modify post content
- **Delete Post**: Remove post
- **Get Posts by Category**: Filter posts by category
- **Get Posts by Author**: Filter posts by author

### 7. 🏷️ ABAC Attributes Testing
- **Create Attribute**: Add new attribute
- **Get All Attributes**: List all attributes
- **Get Attribute by ID**: Get specific attribute details
- **Update Attribute**: Modify attribute information
- **Delete Attribute**: Remove attribute

### 8. 👤 User Attributes Testing
- **Create User Attribute**: Assign attribute to user
- **Get User Attributes**: View user's attributes
- **Update User Attribute**: Modify user attribute
- **Delete User Attribute**: Remove user attribute

### 9. 🎯 Resource Attributes Testing
- **Create Resource Attribute**: Assign attribute to resource
- **Get Resource Attributes**: View resource's attributes
- **Update Resource Attribute**: Modify resource attribute
- **Delete Resource Attribute**: Remove resource attribute

### 10. 🚀 Admin Operations Testing
- **Get System Stats**: View system statistics
- **Get User Activity**: Monitor user activity
- **Get System Logs**: Access system logs

### 11. 🧪 ABAC Testing Scenarios
- **Test Time-Based Access**: Verify time-based restrictions
- **Test Department Access**: Check department-based permissions
- **Test Security Level Access**: Validate security level restrictions

## 🔧 Testing Tips

1. **Start with Authentication**: Always authenticate first to get valid JWT token
2. **Use Environment Variables**: Leverage Postman's environment variables for dynamic values
3. **Check Response Codes**: Verify HTTP status codes match expected results
4. **Test Edge Cases**: Try invalid inputs, missing data, and boundary conditions
5. **Verify Permissions**: Ensure RBAC and ABAC rules are working correctly

## 🐛 Troubleshooting

### Common Issues:
- **401 Unauthorized**: Check if JWT token is valid and not expired
- **403 Forbidden**: Verify user has required permissions for the action
- **404 Not Found**: Ensure the requested resource exists
- **500 Internal Server Error**: Check server logs for detailed error information

### Debug Steps:
1. Check server console for error messages
2. Verify database connection and table existence
3. Ensure all required environment variables are set
4. Check if seeders have been run successfully

## 📚 Additional Resources

- **ABAC Implementation Details**: See `ABAC_README.md`
- **CRUD Operations Summary**: See `CRUD_OPERATIONS_SUMMARY.md`
- **API Documentation**: Check individual route files for detailed endpoint information

---

**Happy Testing! 🎉**
