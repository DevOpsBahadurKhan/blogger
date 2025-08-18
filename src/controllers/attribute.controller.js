import AttributeService from '../services/attribute.service.js';
import logger from '../utils/logger.js';

class AttributeController {
  /**
   * Create a new attribute
   */
  async createAttribute(req, res, next) {
    try {
      const attributeData = req.body;
      const attribute = await AttributeService.createAttribute(attributeData);

      logger.info('[AttributeController] Attribute created', {
        attributeId: attribute.id,
        name: attribute.name,
        userId: req.user?.id
      });

      res.status(201).json({
        success: true,
        message: 'Attribute created successfully',
        data: attribute
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all attributes
   */
  async getAllAttributes(req, res, next) {
    try {
      const { page = 1, limit = 10, search } = req.query;
      const attributes = await AttributeService.getAllAttributes({ page, limit, search });

      res.status(200).json({
        success: true,
        data: attributes
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get attribute by ID
   */
  async getAttributeById(req, res, next) {
    try {
      const { id } = req.params;
      const attribute = await AttributeService.getAttributeById(id);

      if (!attribute) {
        return res.status(404).json({
          success: false,
          message: 'Attribute not found'
        });
      }

      res.status(200).json({
        success: true,
        data: attribute
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update attribute
   */
  async updateAttribute(req, res, next) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const attribute = await AttributeService.updateAttribute(id, updateData);

      if (!attribute) {
        return res.status(404).json({
          success: false,
          message: 'Attribute not found'
        });
      }

      logger.info('[AttributeController] Attribute updated', {
        attributeId: id,
        userId: req.user?.id
      });

      res.status(200).json({
        success: true,
        message: 'Attribute updated successfully',
        data: attribute
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete attribute
   */
  async deleteAttribute(req, res, next) {
    try {
      const { id } = req.params;
      const deleted = await AttributeService.deleteAttribute(id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Attribute not found'
        });
      }

      logger.info('[AttributeController] Attribute deleted', {
        attributeId: id,
        userId: req.user?.id
      });

      res.status(200).json({
        success: true,
        message: 'Attribute deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get user attributes
   */
  async getUserAttributes(req, res, next) {
    try {
      const { userId } = req.params;
      const attributes = await AttributeService.getUserAttributes(userId);

      res.status(200).json({
        success: true,
        data: attributes
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Set user attribute value
   */
  async setUserAttribute(req, res, next) {
    try {
      const { userId } = req.params;
      const { attributeId, value, metadata } = req.body;

      const userAttribute = await AttributeService.setUserAttribute(userId, attributeId, value, metadata);

      logger.info('[AttributeController] User attribute set', {
        userId,
        attributeId,
        value,
        adminId: req.user?.id
      });

      res.status(200).json({
        success: true,
        message: 'User attribute set successfully',
        data: userAttribute
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get resource attributes
   */
  async getResourceAttributes(req, res, next) {
    try {
      const { resourceName, resourceId } = req.params;
      const attributes = await AttributeService.getResourceAttributes(resourceName, resourceId);

      res.status(200).json({
        success: true,
        data: attributes
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Set resource attribute value
   */
  async setResourceAttribute(req, res, next) {
    try {
      const { resourceName, resourceId } = req.params;
      const { attributeId, value, metadata } = req.body;

      const resourceAttribute = await AttributeService.setResourceAttribute(
        resourceName,
        resourceId,
        attributeId,
        value,
        metadata
      );

      logger.info('[AttributeController] Resource attribute set', {
        resourceName,
        resourceId,
        attributeId,
        value,
        adminId: req.user?.id
      });

      res.status(200).json({
        success: true,
        message: 'Resource attribute set successfully',
        data: resourceAttribute
      });
    } catch (error) {
      next(error);
    }
  }
}

// Create instance and bind all methods
const controller = new AttributeController();
const boundController = {
  createAttribute: controller.createAttribute.bind(controller),
  getAllAttributes: controller.getAllAttributes.bind(controller),
  getAttributeById: controller.getAttributeById.bind(controller),
  updateAttribute: controller.updateAttribute.bind(controller),
  deleteAttribute: controller.deleteAttribute.bind(controller),
  getUserAttributes: controller.getUserAttributes.bind(controller),
  setUserAttribute: controller.setUserAttribute.bind(controller),
  getResourceAttributes: controller.getResourceAttributes.bind(controller),
  setResourceAttribute: controller.setResourceAttribute.bind(controller)
};

// Change the export to named exports
export const {
  createAttribute,
  getAllAttributes,
  getAttributeById,
  updateAttribute,
  deleteAttribute,
  getUserAttributes,
  setUserAttribute,
  getResourceAttributes,
  setResourceAttribute
} = boundController;
