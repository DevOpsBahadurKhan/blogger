# 🚀 ABAC (Attribute-Based Access Control) Implementation

## Overview

Your BlogBuddy project now includes a **full ABAC system** that works alongside the existing RBAC system. This provides **granular, dynamic access control** based on user attributes, resource attributes, time, and environment conditions.

## 🏗️ Architecture

```
Request → RBAC Check → ABAC Evaluation → Access Decision
```

- **RBAC**: First checks if the user's role has permission for the resource/action
- **ABAC**: Then evaluates dynamic conditions based on attributes
- **Final Decision**: Both must pass for access to be granted

## 🔧 Key Components

### 1. **ABAC Engine** (`src/utils/abacEngine.js`)
- Evaluates dynamic conditions
- Supports multiple data types (string, number, boolean, date, array)
- Handles user, resource, time, and environment attributes

### 2. **Enhanced Access Control** (`src/utils/accessControl.js`)
- Combines RBAC and ABAC logic
- Provides unified access checking interface
- Maintains backward compatibility

### 3. **Attribute Management**
- **Attributes**: Define what properties can be used in conditions
- **User Attributes**: Store user-specific values (department, location, security level)
- **Resource Attributes**: Store resource-specific values (category, visibility, priority)

### 4. **Policy System**
- **Policies**: Define complex access rules
- **Policy Conditions**: Specify attribute-based conditions
- **Priority-based evaluation**: Higher priority policies are evaluated first

## 📊 Database Schema

### Core Tables
```sql
-- Attributes definition
attributes (id, name, description, dataType, isSystem)

-- User attribute values
user_attributes (id, user_id, attribute_id, value, metadata)

-- Resource attribute values  
resource_attributes (id, resource_name, resource_id, attribute_id, value, metadata)

-- Policies
policies (id, name, description, effect, priority, isActive, resource, action, possession)

-- Policy conditions
policy_conditions (id, policy_id, attribute_id, operator, value, applies_to, logical_operator, order)
```

## 🎯 Usage Examples

### 1. **Simple Condition in Permission**
```javascript
// Permission with condition: "user.department == post.department"
{
  resource: 'post',
  action: 'read',
  possession: 'any',
  condition: 'user.department == post.department'
}
```

### 2. **Time-Based Access**
```javascript
// Only allow during business hours
{
  resource: 'post',
  action: 'create',
  possession: 'any',
  condition: 'time.business_hours == true'
}
```

### 3. **Security Level Access**
```javascript
// Only high security users can access sensitive content
{
  resource: 'post',
  action: 'read',
  possession: 'any',
  condition: 'user.security_level >= 4'
}
```

## 🚀 API Endpoints

### Attribute Management
```bash
# Create attribute
POST /api/attributes
{
  "name": "department",
  "description": "User department",
  "dataType": "string"
}

# Get all attributes
GET /api/attributes?page=1&limit=10&search=department

# Update attribute
PUT /api/attributes/:id
{
  "description": "Updated description"
}
```

### User Attributes
```bash
# Get user attributes
GET /api/users/:userId/attributes

# Set user attribute
POST /api/users/:userId/attributes
{
  "attributeId": 1,
  "value": "IT",
  "metadata": { "source": "admin" }
}
```

### Resource Attributes
```bash
# Get resource attributes
GET /api/resources/post/123/attributes

# Set resource attribute
POST /api/resources/post/123/attributes
{
  "attributeId": 6,
  "value": "IT",
  "metadata": { "setBy": "admin" }
}
```

## 🔒 Access Control Examples

### 1. **Department-Based Access**
```javascript
// Users can only access posts from their own department
const condition = 'user.department == post.department';

// In your route
router.get('/posts/:id', 
  verifyAccess('read', 'post', 'any'),
  controller.getPost
);
```

### 2. **Enhanced Resource Loading**
```javascript
// For complex ABAC scenarios
const resourceLoader = async (req) => {
  const { Post } = await import('../models/index.js');
  return await Post.findByPk(req.params.id);
};

router.put('/posts/:id',
  verifyAccessWithResource('update', 'post', 'own', resourceLoader),
  controller.updatePost
);
```

### 3. **Custom ABAC Checks**
```javascript
import { hasPermission } from '../utils/accessControl.js';

// In your controller
const canAccess = await hasPermission(
  req.user, 
  'post', 
  'read', 
  'any', 
  postObject
);

if (!canAccess) {
  return res.status(403).json({ message: 'Access denied' });
}
```

## 🎨 Supported Operators

### Comparison Operators
- `==` - Equal to
- `!=` - Not equal to
- `>` - Greater than
- `<` - Less than
- `>=` - Greater than or equal to
- `<=` - Less than or equal to

### String Operators
- `in` - Value is in array
- `contains` - String contains substring
- `regex` - Regular expression match

## ⏰ Time-Based Attributes

### Available Time Attributes
- `time.hour` - Current hour (0-23)
- `time.day` - Current day (0-6, Sunday-Saturday)
- `time.month` - Current month (1-12)
- `time.year` - Current year
- `time.weekday` - Day name (Sunday, Monday, etc.)
- `time.business_hours` - Boolean for 9 AM - 5 PM

### Example Usage
```javascript
// Only allow access during business hours
condition: 'time.business_hours == true'

// Only allow on weekdays
condition: 'time.weekday != Sunday && time.weekday != Saturday'
```

## 🌍 Environment Attributes

### Available Environment Attributes
- `env.environment` - NODE_ENV value
- `env.timezone` - User's timezone
- `env.CUSTOM_VAR` - Any environment variable

### Example Usage
```javascript
// Only allow in production
condition: 'env.environment == production'

// Only allow in specific timezone
condition: 'env.timezone == America/New_York'
```

## 🔧 Configuration

### 1. **Database Migration**
```bash
# Run the attribute seeder
npm run seed
```

### 2. **Environment Variables**
```bash
# Optional: Set custom attributes
NODE_ENV=development
CUSTOM_ATTRIBUTE=value
```

### 3. **Model Associations**
Make sure your models include the new ABAC models:
```javascript
// In your models/index.js
import Attribute from './attribute.model.js';
import UserAttribute from './userAttribute.model.js';
import ResourceAttribute from './resourceAttribute.model.js';
import Policy from './policy.model.js';
import PolicyCondition from './policyCondition.model.js';
```

## 🧪 Testing ABAC

### 1. **Create Test Attributes**
```bash
# Create department attribute
POST /api/attributes
{
  "name": "department",
  "description": "User department",
  "dataType": "string"
}
```

### 2. **Set User Attributes**
```bash
# Set user department
POST /api/users/1/attributes
{
  "attributeId": 1,
  "value": "IT"
}
```

### 3. **Set Resource Attributes**
```bash
# Set post category
POST /api/resources/post/1/attributes
{
  "attributeId": 6,
  "value": "IT"
}
```

### 4. **Test Access Control**
```bash
# Try to access post - should work if departments match
GET /api/posts/1
```

## 🚨 Troubleshooting

### Common Issues

1. **Attribute Not Found**
   - Check if attribute exists in database
   - Verify attribute name spelling

2. **Condition Evaluation Fails**
   - Check condition syntax: `entity.attribute operator value`
   - Verify attribute values are set
   - Check data type compatibility

3. **Performance Issues**
   - Use database indexes on attribute tables
   - Consider caching frequently accessed attributes
   - Limit complex condition evaluations

### Debug Logging
The system includes comprehensive logging:
```javascript
// Check logs for ABAC evaluation details
logger.debug('[ABAC] Condition evaluation', {
  condition,
  leftValue,
  rightValue,
  operator,
  result
});
```

## 🔮 Future Enhancements

### Planned Features
1. **Condition Builder UI** - Visual policy editor
2. **Attribute Templates** - Predefined attribute sets
3. **Policy Inheritance** - Hierarchical policy structure
4. **Real-time Updates** - Dynamic policy changes
5. **Performance Optimization** - Caching and query optimization

### Custom Extensions
You can extend the ABAC engine by:
- Adding new operators
- Creating custom attribute types
- Implementing complex condition logic
- Adding external data sources

## 📚 Additional Resources

- **Casbin Documentation**: https://casbin.org/
- **ABAC Best Practices**: Industry standards and recommendations
- **Performance Tuning**: Database optimization strategies
- **Security Considerations**: Best practices for access control

---

## 🎉 Congratulations!

You now have a **production-ready ABAC system** that provides:
- ✅ **Granular access control** based on dynamic attributes
- ✅ **Time-based restrictions** for business logic
- ✅ **Environment-aware policies** for deployment flexibility
- ✅ **Comprehensive API** for attribute management
- ✅ **Backward compatibility** with existing RBAC
- ✅ **Extensible architecture** for future enhancements

Your BlogBuddy project is now equipped with **enterprise-grade access control**! 🚀
