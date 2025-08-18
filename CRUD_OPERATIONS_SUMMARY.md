# BlogBuddy CRUD Operations Summary

This document provides a comprehensive overview of all CRUD (Create, Read, Update, Delete) operations available in the BlogBuddy API, organized by entity type.

## 🔐 Authentication

### Endpoints:
- **POST** `/api/auth/login` - User login
- **POST** `/api/auth/register` - User registration

## 👥 User Management

### Endpoints:
- **GET** `/api/users` - Get all users
- **GET** `/api/users/:id` - Get user by ID
- **POST** `/api/users` - Create new user
- **PUT** `/api/users/:id` - Update user profile
- **DELETE** `/api/users/:id` - Delete user
- **GET** `/api/users/:id/role` - Get user's role
- **GET** `/api/users/:id/permissions` - Get user's permissions

## 🎭 Role Management

### Endpoints:
- **POST** `/api/roles` - Create new role
- **GET** `/api/roles` - Get all roles
- **GET** `/api/roles/:id` - Get role by ID
- **PUT** `/api/roles/:id` - Update role
- **DELETE** `/api/roles/:id` - Delete role
- **GET** `/api/roles/:id/permissions` - Get role permissions
- **GET** `/api/roles/:id/users` - Get role users

## 🔑 Permission Management

### Endpoints:
- **POST** `/api/permissions` - Create new permission
- **GET** `/api/permissions` - Get all permissions
- **GET** `/api/permissions/:id` - Get permission by ID
- **PUT** `/api/permissions/:id` - Update permission
- **DELETE** `/api/permissions/:id` - Delete permission
- **GET** `/api/permissions/resource/:resource` - Get permissions by resource
- **GET** `/api/permissions/action/:action` - Get permissions by action

## 👥 User-Role Management

### Endpoints:
- **POST** `/api/users/:userId/roles/:roleId` - Assign role to user
- **DELETE** `/api/users/:userId/roles/:roleId` - Remove role from user
- **GET** `/api/users/:userId/roles` - Get user's roles
- **GET** `/api/users/:userId/roles/permissions` - Get user's roles with permissions
- **GET** `/api/roles/:roleId/users` - Get users with specific role
- **PUT** `/api/users/:userId/roles/:roleId` - Update user-role relationship
- **PATCH** `/api/users/:userId/roles/:roleId/deactivate` - Deactivate user role
- **PATCH** `/api/users/:userId/roles/:roleId/activate` - Activate user role
- **POST** `/api/users/:userId/roles/bulk-assign` - Bulk assign roles to user
- **POST** `/api/users/:userId/roles/bulk-remove` - Bulk remove roles from user
- **GET** `/api/users/:userId/roles/:roleId/check` - Check if user has specific role

## 📝 Blog Posts

### Endpoints:
- **POST** `/api/posts` - Create new post
- **GET** `/api/posts` - Get all posts
- **GET** `/api/posts/:id` - Get post by ID
- **PUT** `/api/posts/:id` - Update post
- **DELETE** `/api/posts/:id` - Delete post
- **GET** `/api/posts/category/:category` - Get posts by category
- **GET** `/api/posts/author/:authorId` - Get posts by author

## 🏷️ ABAC Attributes

### Endpoints:
- **POST** `/api/attributes` - Create new attribute
- **GET** `/api/attributes` - Get all attributes
- **GET** `/api/attributes/:id` - Get attribute by ID
- **PUT** `/api/attributes/:id` - Update attribute
- **DELETE** `/api/attributes/:id` - Delete attribute

## 👤 User Attributes

### Endpoints:
- **POST** `/api/users/:userId/attributes` - Set user attribute
- **GET** `/api/users/:userId/attributes` - Get user attributes
- **PUT** `/api/users/:userId/attributes/:attributeId` - Update user attribute
- **DELETE** `/api/users/:userId/attributes/:attributeId` - Delete user attribute

## 🎯 Resource Attributes

### Endpoints:
- **POST** `/api/resources/:resourceType/:resourceId/attributes` - Set resource attribute
- **GET** `/api/resources/:resourceType/:resourceId/attributes` - Get resource attributes
- **PUT** `/api/resources/:resourceType/:resourceId/attributes/:attributeId` - Update resource attribute
- **DELETE** `/api/resources/:resourceType/:resourceId/attributes/:attributeId` - Delete resource attribute

## 🚀 Admin Operations

### Endpoints:
- **GET** `/api/admin/stats` - Get system statistics
- **GET** `/api/admin/users/activity` - Get user activity
- **GET** `/api/admin/logs` - Get system logs
- **POST** `/api/admin/roles/:roleId/permissions/:permissionId` - Assign permission to role

## 🧪 ABAC Testing Scenarios

### Endpoints:
- **GET** `/api/test/time-access` - Test time-based access control
- **GET** `/api/test/department-access` - Test department-based access control
- **GET** `/api/test/security-level-access` - Test security level access control

## 📊 Data Models

### Core Entities:
- **User**: Basic user information and authentication
- **Role**: Defines user roles and responsibilities
- **Permission**: Defines what actions can be performed on resources
- **UserRole**: Many-to-many relationship between users and roles
- **RolePermission**: Many-to-many relationship between roles and permissions
- **Post**: Blog post content and metadata
- **Attribute**: Dynamic attributes for ABAC policies
- **UserAttribute**: User-specific attribute values
- **ResourceAttribute**: Resource-specific attribute values
- **Policy**: ABAC policy definitions
- **PolicyCondition**: Conditions within ABAC policies

## 🔐 Access Control

### RBAC (Role-Based Access Control):
- Users are assigned roles
- Roles have permissions
- Access is granted based on role permissions

### ABAC (Attribute-Based Access Control):
- Dynamic access control based on attributes
- Time-based restrictions
- Department-based access
- Security level requirements
- Environment-based policies

## 🚀 Usage Examples

### 1. Assign Multiple Roles to User:
```bash
POST /api/users/1/roles/bulk-assign
{
  "roleIds": [1, 2, 3]
}
```

### 2. Check User Permissions:
```bash
GET /api/users/1/roles/permissions
```

### 3. Create Time-Based Policy:
```bash
POST /api/attributes
{
  "name": "business_hours",
  "description": "Business hours restriction",
  "dataType": "time_range"
}
```

## 📋 Testing Checklist

### ✅ Basic CRUD Operations:
- [ ] Create entities
- [ ] Read entities
- [ ] Update entities
- [ ] Delete entities
- [ ] List all entities

### ✅ Relationship Management:
- [ ] Assign roles to users
- [ ] Assign permissions to roles
- [ ] Set user attributes
- [ ] Set resource attributes

### ✅ Access Control:
- [ ] RBAC enforcement
- [ ] ABAC policy evaluation
- [ ] Permission validation
- [ ] Attribute-based restrictions

### ✅ Edge Cases:
- [ ] Invalid data handling
- [ ] Missing relationships
- [ ] Circular references
- [ ] Performance under load

---

**Total Endpoints: 50+** | **Entities: 11** | **Access Control: RBAC + ABAC**
