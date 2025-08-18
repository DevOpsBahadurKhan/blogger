import AttributeRepository from '../repositories/attribute.repository.js';
import logger from '../utils/logger.js';

class AttributeService {
  /**
   * Create a new attribute
   */
  async createAttribute(attributeData) {
    try {
      // Validate required fields
      if (!attributeData.name || !attributeData.dataType) {
        const error = new Error('Name and dataType are required');
        error.statusCode = 400;
        throw error;
      }

      // Check if attribute already exists
      const existingAttribute = await AttributeRepository.findByName(attributeData.name);
      if (existingAttribute) {
        const error = new Error('Attribute with this name already exists');
        error.statusCode = 409;
        throw error;
      }

      const attribute = await AttributeRepository.createAttribute(attributeData);
      
      logger.info('[AttributeService] Attribute created', { 
        attributeId: attribute.id, 
        name: attribute.name 
      });
      
      return attribute;
    } catch (error) {
      logger.error('[AttributeService] Error creating attribute', { 
        error: error.message, 
        data: attributeData 
      });
      throw error;
    }
  }

  /**
   * Get all attributes with pagination and search
   */
  async getAllAttributes({ page = 1, limit = 10, search = '' }) {
    try {
      const offset = (page - 1) * limit;
      const attributes = await AttributeRepository.getAllAttributes({ limit, offset, search });
      
      return attributes;
    } catch (error) {
      logger.error('[AttributeService] Error getting attributes', { error: error.message });
      throw error;
    }
  }

  /**
   * Get attribute by ID
   */
  async getAttributeById(id) {
    try {
      const attribute = await AttributeRepository.findAttributeById(id);
      return attribute;
    } catch (error) {
      logger.error('[AttributeService] Error getting attribute by ID', { error: error.message, id });
      throw error;
    }
  }

  /**
   * Update attribute
   */
  async updateAttribute(id, updateData) {
    try {
      // Check if attribute exists
      const existingAttribute = await AttributeRepository.findAttributeById(id);
      if (!existingAttribute) {
        const error = new Error('Attribute not found');
        error.statusCode = 404;
        throw error;
      }

      // If name is being updated, check for duplicates
      if (updateData.name && updateData.name !== existingAttribute.name) {
        const duplicateAttribute = await AttributeRepository.findByName(updateData.name);
        if (duplicateAttribute) {
          const error = new Error('Attribute with this name already exists');
          error.statusCode = 409;
          throw error;
        }
      }

      const updatedAttribute = await AttributeRepository.updateAttribute(id, updateData);
      
      logger.info('[AttributeService] Attribute updated', { attributeId: id });
      
      return updatedAttribute;
    } catch (error) {
      logger.error('[AttributeService] Error updating attribute', { error: error.message, id });
      throw error;
    }
  }

  /**
   * Delete attribute
   */
  async deleteAttribute(id) {
    try {
      // Check if attribute exists
      const existingAttribute = await AttributeRepository.findAttributeById(id);
      if (!existingAttribute) {
        return false;
      }

      // Check if attribute is in use
      const isInUse = await AttributeRepository.isAttributeInUse(id);
      if (isInUse) {
        const error = new Error('Cannot delete attribute that is currently in use');
        error.statusCode = 400;
        throw error;
      }

      await AttributeRepository.deleteAttribute(id);
      
      logger.info('[AttributeService] Attribute deleted', { attributeId: id });
      
      return true;
    } catch (error) {
      logger.error('[AttributeService] Error deleting attribute', { error: error.message, id });
      throw error;
    }
  }

  /**
   * Get user attributes
   */
  async getUserAttributes(userId) {
    try {
      const userAttributes = await AttributeRepository.getUserAttributes(userId);
      return userAttributes;
    } catch (error) {
      logger.error('[AttributeService] Error getting user attributes', { error: error.message, userId });
      throw error;
    }
  }

  /**
   * Set user attribute value
   */
  async setUserAttribute(userId, attributeId, value, metadata = {}) {
    try {
      // Validate attribute exists
      const attribute = await AttributeRepository.findAttributeById(attributeId);
      if (!attribute) {
        const error = new Error('Attribute not found');
        error.statusCode = 404;
        throw error;
      }

      // Validate value based on data type
      this.validateAttributeValue(attribute.dataType, value);

      const userAttribute = await AttributeRepository.setUserAttribute(userId, attributeId, value, metadata);
      
      logger.info('[AttributeService] User attribute set', { 
        userId, 
        attributeId, 
        value 
      });
      
      return userAttribute;
    } catch (error) {
      logger.error('[AttributeService] Error setting user attribute', { 
        error: error.message, 
        userId, 
        attributeId 
      });
      throw error;
    }
  }

  /**
   * Get resource attributes
   */
  async getResourceAttributes(resourceName, resourceId) {
    try {
      const resourceAttributes = await AttributeRepository.getResourceAttributes(resourceName, resourceId);
      return resourceAttributes;
    } catch (error) {
      logger.error('[AttributeService] Error getting resource attributes', { 
        error: error.message, 
        resourceName, 
        resourceId 
      });
      throw error;
    }
  }

  /**
   * Set resource attribute value
   */
  async setResourceAttribute(resourceName, resourceId, attributeId, value, metadata = {}) {
    try {
      // Validate attribute exists
      const attribute = await AttributeRepository.findAttributeById(attributeId);
      if (!attribute) {
        const error = new Error('Attribute not found');
        error.statusCode = 404;
        throw error;
      }

      // Validate value based on data type
      this.validateAttributeValue(attribute.dataType, value);

      const resourceAttribute = await AttributeRepository.setResourceAttribute(
        resourceName, 
        resourceId, 
        attributeId, 
        value, 
        metadata
      );
      
      logger.info('[AttributeService] Resource attribute set', { 
        resourceName, 
        resourceId, 
        attributeId, 
        value 
      });
      
      return resourceAttribute;
    } catch (error) {
      logger.error('[AttributeService] Error setting resource attribute', { 
        error: error.message, 
        resourceName, 
        resourceId, 
        attributeId 
      });
      throw error;
    }
  }

  /**
   * Validate attribute value based on data type
   */
  validateAttributeValue(dataType, value) {
    switch (dataType) {
      case 'number':
        if (isNaN(Number(value))) {
          const error = new Error('Value must be a valid number');
          error.statusCode = 400;
          throw error;
        }
        break;
      case 'boolean':
        if (typeof value !== 'boolean' && !['true', 'false', '0', '1'].includes(String(value))) {
          const error = new Error('Value must be a valid boolean');
          error.statusCode = 400;
          throw error;
        }
        break;
      case 'date':
        if (isNaN(Date.parse(value))) {
          const error = new Error('Value must be a valid date');
          error.statusCode = 400;
          throw error;
        }
        break;
      case 'array':
        if (!Array.isArray(value) && typeof value !== 'string') {
          const error = new Error('Value must be an array or comma-separated string');
          error.statusCode = 400;
          throw error;
        }
        break;
      // string type doesn't need validation
    }
  }
}

export default new AttributeService();
