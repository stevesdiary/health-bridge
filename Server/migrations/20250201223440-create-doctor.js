'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     * 
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    // First, check if the appointments table exists and remove the foreign key constraint if it does
    const appointmentsTableExists = await queryInterface.describeTable('appointments')
      .then(() => true)
      .catch(() => false);

    if (appointmentsTableExists) {
      await queryInterface.removeConstraint(
        'appointments',
        'appointments_doctor_id_fkey'
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
        }
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
    });

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
      });
    }
  },

  async down (queryInterface, Sequelize) {
    // First remove the foreign key constraint
    await queryInterface.removeConstraint(
      'appointments',
      'appointments_doctor_id_fkey'
    );

    // Then drop the doctors table
    await queryInterface.dropTable('doctors');
  }
};
