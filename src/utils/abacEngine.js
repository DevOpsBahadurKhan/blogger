// ABAC (Attribute-Based Access Control) Engine
import db from '../models/index.js';
import logger from './logger.js';

const { UserAttribute, ResourceAttribute, Attribute } = db;

class ABACEngine {
    constructor() {
        this.operators = {
            '==': (a, b) => a == b,
            '!=': (a, b) => a != b,
            '>': (a, b) => Number(a) > Number(b),
            '<': (a, b) => Number(a) < Number(b),
            '>=': (a, b) => Number(a) >= Number(b),
            '<=': (a, b) => Number(a) <= Number(b),
            'in': (a, b) => b.includes(a),
            'contains': (a, b) => a.includes(b),
            'regex': (a, b) => new RegExp(b).test(a)
        };
    }

    /**
     * Evaluate a condition string against user and resource attributes
     * @param {string} condition - Condition string (e.g., "user.department == post.department")
     * @param {Object} user - User object with attributes
     * @param {Object} resource - Resource object with attributes
     * @returns {boolean} - Whether condition is met
     */
    async evaluateCondition(condition, user, resource) {
        try {
            if (!condition || condition.trim() === '') {
                return true; // No condition means always allow
            }

            // Parse condition: "user.department == post.department"
            const parts = condition.split(' ');
            if (parts.length !== 3) {
                logger.warn('[ABAC] Invalid condition format', { condition });
                return false;
            }

            const [leftSide, operator, rightSide] = parts;

            if (!this.operators[operator]) {
                logger.warn('[ABAC] Unsupported operator', { operator, condition });
                return false;
            }

            // Extract values from left and right sides
            const leftValue = await this.extractValue(leftSide, user, resource);
            const rightValue = await this.extractValue(rightSide, user, resource);

            // Evaluate the condition
            const result = this.operators[operator](leftValue, rightValue);

            logger.debug('[ABAC] Condition evaluation', {
                condition,
                leftValue,
                rightValue,
                operator,
                result
            });

            return result;
        } catch (error) {
            logger.error('[ABAC] Error evaluating condition', {
                error: error.message,
                condition,
                user: user?.id,
                resource: resource?.id
            });
            return false;
        }
    }

    /**
     * Extract value from attribute path (e.g., "user.department" or "post.category")
     */
    async extractValue(path, user, resource) {
        const [entity, attributeName] = path.split('.');

        if (entity === 'user') {
            return await this.getUserAttributeValue(user.id, attributeName);
        } else if (entity === 'post' || entity === 'resource') {
            return await this.getResourceAttributeValue(resource.id, attributeName);
        } else if (entity === 'time') {
            return this.getTimeAttribute(attributeName);
        } else if (entity === 'env') {
            return this.getEnvironmentAttribute(attributeName);
        }

        return null;
    }

    /**
     * Get user attribute value from database
     */
    async getUserAttributeValue(userId, attributeName) {
        try {
            const userAttr = await UserAttribute.findOne({
                include: [{
                    model: Attribute,
                    where: { name: attributeName }
                }],
                where: { user_id: userId }
            });

            return userAttr?.value || null;
        } catch (error) {
            logger.error('[ABAC] Error getting user attribute', { userId, attributeName, error: error.message });
            return null;
        }
    }

    /**
     * Get resource attribute value from database
     */
    async getResourceAttributeValue(resourceId, attributeName) {
        try {
            const resourceAttr = await ResourceAttribute.findOne({
                include: [{
                    model: Attribute,
                    where: { name: attributeName }
                }],
                where: { resource_id: resourceId }
            });

            return resourceAttr?.value || null;
        } catch (error) {
            logger.error('[ABAC] Error getting resource attribute', { resourceId, attributeName, error: error.message });
            return null;
        }
    }

    /**
     * Get time-based attributes
     */
    getTimeAttribute(attributeName) {
        const now = new Date();

        switch (attributeName) {
            case 'hour':
                return now.getHours();
            case 'day':
                return now.getDay(); // 0-6 (Sunday-Saturday)
            case 'month':
                return now.getMonth() + 1; // 1-12
            case 'year':
                return now.getFullYear();
            case 'weekday':
                return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][now.getDay()];
            case 'business_hours':
                const hour = now.getHours();
                return hour >= 9 && hour <= 17;
            default:
                return null;
        }
    }

    /**
     * Get environment-based attributes
     */
    getEnvironmentAttribute(attributeName) {
        switch (attributeName) {
            case 'environment':
                return process.env.NODE_ENV || 'development';
            case 'timezone':
                return Intl.DateTimeFormat().resolvedOptions().timeZone;
            default:
                return process.env[attributeName] || null;
        }
    }

    /**
     * Validate condition syntax
     */
    validateCondition(condition) {
        if (!condition || condition.trim() === '') {
            return { valid: true, message: 'No condition specified' };
        }

        const parts = condition.split(' ');
        if (parts.length !== 3) {
            return { valid: false, message: 'Condition must have format: entity.attribute operator value' };
        }

        const [leftSide, operator, rightSide] = parts;

        if (!this.operators[operator]) {
            return { valid: false, message: `Unsupported operator: ${operator}` };
        }

        if (!leftSide.includes('.') || !rightSide.includes('.')) {
            return { valid: false, message: 'Both sides must reference entity.attribute' };
        }

        return { valid: true, message: 'Valid condition' };
    }
}

export default new ABACEngine();
