'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Make this seeder resilient to column name differences across environments
    // attributes table may have: 'type' OR 'dataType' OR 'data_type'
    let typeColumn = null;
    try {
      const tableDef = await queryInterface.describeTable('attributes');
      if (tableDef.type) typeColumn = 'type';
      else if (tableDef.dataType) typeColumn = 'dataType';
      else if (tableDef.data_type) typeColumn = 'data_type';
    } catch (e) {
      // Fallback: assume 'type'
      typeColumn = 'type';
    }

    const base = (name, description) => {
      const row = { name, description };
      if (typeColumn) row[typeColumn] = 'string';
      return row;
    };

    const attributes = [
      base('department', 'User department such as Engineering, Marketing, Sales'),
      base('location', 'User office location/city'),
      base('experience_level', 'Experience level e.g., junior, intermediate, senior, expert'),
    ];

    await queryInterface.bulkInsert('attributes', attributes, { ignoreDuplicates: true });
    console.log(`✅ Seeded base attributes: ${attributes.map(a => a.name).join(', ')} using ${typeColumn || 'no-type-column'}`);
  },

  down: async (queryInterface, Sequelize) => {
    // Remove only the attributes seeded above
    await queryInterface.bulkDelete('attributes', {
      name: { [Sequelize.Op.in]: ['department', 'location', 'experience_level'] }
    });
  }
};
