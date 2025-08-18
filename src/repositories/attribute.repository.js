import db from '../models/index.js';

const { Attribute, UserAttribute, ResourceAttribute } = db;

class AttributeRepository {
  /**
   * Create a new attribute
   */
  async createAttribute(attributeData) {
    return await Attribute.create(attributeData);
  }

  /**
   * Find attribute by name
   */
  async findByName(name) {
    return await Attribute.findOne({ where: { name } });
  }

  /**
   * Find attribute by ID
   */
  async findAttributeById(id) {
    return await Attribute.findByPk(id);
  }

  /**
   * Get all attributes with pagination and search
   */
  async getAllAttributes({ limit = 10, offset = 0, search = '' }) {
    const whereClause = search ? {
      [db.Sequelize.Op.or]: [
        { name: { [db.Sequelize.Op.like]: `%${search}%` } },
        { description: { [db.Sequelize.Op.like]: `%${search}%` } }
      ]
    } : {};

    const { count, rows } = await Attribute.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: [['name', 'ASC']]
    });

    return {
      attributes: rows,
      total: count,
      page: Math.floor(offset / limit) + 1,
      totalPages: Math.ceil(count / limit)
    };
  }

  /**
   * Update attribute
   */
  async updateAttribute(id, updateData) {
    const [updatedRows] = await Attribute.update(updateData, {
      where: { id },
      returning: true
    });

    if (updatedRows > 0) {
      return await this.findAttributeById(id);
    }
    return null;
  }

  /**
   * Delete attribute
   */
  async deleteAttribute(id) {
    return await Attribute.destroy({ where: { id } });
  }

  /**
   * Check if attribute is in use
   */
  async isAttributeInUse(attributeId) {
    const userAttributeCount = await UserAttribute.count({ where: { attribute_id: attributeId } });
    const resourceAttributeCount = await ResourceAttribute.count({ where: { attribute_id: attributeId } });
    
    return userAttributeCount > 0 || resourceAttributeCount > 0;
  }

  /**
   * Get user attributes
   */
  async getUserAttributes(userId) {
    return await UserAttribute.findAll({
      where: { user_id: userId },
      include: [{
        model: Attribute,
        as: 'attribute',
        attributes: ['id', 'name', 'description', 'dataType']
      }],
      order: [['createdAt', 'ASC']]
    });
  }

  /**
   * Set user attribute value (upsert)
   */
  async setUserAttribute(userId, attributeId, value, metadata = {}) {
    const [userAttribute, created] = await UserAttribute.findOrCreate({
      where: { user_id: userId, attribute_id: attributeId },
      defaults: { value, metadata }
    });

    if (!created) {
      // Update existing attribute
      userAttribute.value = value;
      userAttribute.metadata = metadata;
      await userAttribute.save();
    }

    return userAttribute;
  }

  /**
   * Get resource attributes
   */
  async getResourceAttributes(resourceName, resourceId) {
    return await ResourceAttribute.findAll({
      where: { resource_name: resourceName, resource_id: resourceId },
      include: [{
        model: Attribute,
        as: 'attribute',
        attributes: ['id', 'name', 'description', 'dataType']
      }],
      order: [['createdAt', 'ASC']]
    });
  }

  /**
   * Set resource attribute value (upsert)
   */
  async setResourceAttribute(resourceName, resourceId, attributeId, value, metadata = {}) {
    const [resourceAttribute, created] = await ResourceAttribute.findOrCreate({
      where: { 
        resource_name: resourceName, 
        resource_id: resourceId, 
        attribute_id: attributeId 
      },
      defaults: { value, metadata }
    });

    if (!created) {
      // Update existing attribute
      resourceAttribute.value = value;
      resourceAttribute.metadata = metadata;
      await resourceAttribute.save();
    }

    return resourceAttribute;
  }

  /**
   * Get attribute usage statistics
   */
  async getAttributeUsageStats() {
    const userAttributeStats = await UserAttribute.findAll({
      attributes: [
        'attribute_id',
        [db.Sequelize.fn('COUNT', db.Sequelize.col('id')), 'usage_count']
      ],
      group: ['attribute_id'],
      include: [{
        model: Attribute,
        as: 'attribute',
        attributes: ['name']
      }]
    });

    const resourceAttributeStats = await ResourceAttribute.findAll({
      attributes: [
        'attribute_id',
        [db.Sequelize.fn('COUNT', db.Sequelize.col('id')), 'usage_count']
      ],
      group: ['attribute_id'],
      include: [{
        model: Attribute,
        as: 'attribute',
        attributes: ['name']
      }]
    });

    return {
      userAttributes: userAttributeStats,
      resourceAttributes: resourceAttributeStats
    };
  }

  /**
   * Bulk create attributes
   */
  async bulkCreateAttributes(attributes) {
    return await Attribute.bulkCreate(attributes, { returning: true });
  }

  /**
   * Get attributes by data type
   */
  async getAttributesByDataType(dataType) {
    return await Attribute.findAll({
      where: { dataType },
      order: [['name', 'ASC']]
    });
  }

  /**
   * Get system attributes
   */
  async getSystemAttributes() {
    return await Attribute.findAll({
      where: { isSystem: true },
      order: [['name', 'ASC']]
    });
  }
}

export default new AttributeRepository();
