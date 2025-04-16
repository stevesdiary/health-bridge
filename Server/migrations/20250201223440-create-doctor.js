'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (t) => {
      // First, check if the appointments table exists and remove the foreign key constraint if it does
      const appointmentsTableExists = await queryInterface.describeTable('appointments', { transaction: t })
        .then(() => true)
        .catch(() => false);

      if (appointmentsTableExists) {
        await queryInterface.removeConstraint(
          'appointments',
          'appointments_doctor_id_fkey',
          { transaction: t }
        );
      }

      // Now create the doctors table
      await queryInterface.createTable('doctors', {
        id: {
          type: Sequelize.UUID,
          primaryKey: true,
          defaultValue: Sequelize.UUIDV4
        },
        first_name: {
          type: Sequelize.STRING,
          allowNull: false
        },
        last_name: {
          type: Sequelize.STRING,
          allowNull: false
        },
        email: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true
        },
        specialty: {
          type: Sequelize.STRING
        },
        phone: {
          type: Sequelize.STRING
        },
        hospital_id: {
          type: Sequelize.UUID,
          references: {
            model: 'hospitals',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL'
        },
        available: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: true
        },
        verified: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false
        },
        is_active: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: true
        },
        role: {
          type: Sequelize.STRING
        },
        created_at: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.NOW
        },
        updated_at: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.NOW
        },
        deleted_at: {
          type: Sequelize.DATE,
          allowNull: true
        }
      }, { transaction: t });

      // Add the foreign key constraint back to the appointments table if it exists
      if (appointmentsTableExists) {
        await queryInterface.addConstraint('appointments', {
          fields: ['doctor_id'],
          type: 'foreign key',
          name: 'appointments_doctor_id_fkey',
          references: {
            table: 'doctors',
            field: 'id'
          },
          onDelete: 'SET NULL',
          onUpdate: 'CASCADE'
        }, { transaction: t });
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (t) => {
      // First remove the foreign key constraint from the appointments table
      await queryInterface.removeConstraint(
        'appointments',
        'appointments_doctor_id_fkey',
        { transaction: t }
      );

      // Then drop the doctors table
      await queryInterface.dropTable('doctors', { transaction: t });
    });
  }
};
