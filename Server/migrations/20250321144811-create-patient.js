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

    // First, check if the payments table exists and remove the foreign key constraint if it does
    const paymentsTableExists = await queryInterface.describeTable('payments')
      .then(() => true)
      .catch(() => false);

    if (paymentsTableExists) {
      await queryInterface.removeConstraint(
        'payments',
        'payments_patient_id_fkey'
      );
    }

    // Now create the patients table
    await queryInterface.createTable('patients', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false
      },
      user_id: {
        type: Sequelize.UUID,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      date_of_birth: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      blood_type: {
        type: Sequelize.STRING,
        allowNull: false
      },
      allergies: {
        type: Sequelize.STRING,
        defaultValue: null
      },
      medical_history: {
        type: Sequelize.STRING
      },
      emergency_contact: {
        type: Sequelize.STRING
      },
      emergency_contact_phone: {
        type: Sequelize.STRING
      },
      insurance_provider: {
        type: Sequelize.STRING
      },
      insurance_number: {
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
        type: Sequelize.DATE
      }
    });

    // Add the foreign key constraint back to the payments table if it exists
    if (paymentsTableExists) {
      await queryInterface.addConstraint('payments', {
        fields: ['patient_id'],
        type: 'foreign key',
        name: 'payments_patient_id_fkey',
        references: {
          table: 'patients',
          field: 'id'
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
      });
    }
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

    // First remove the foreign key constraint from the payments table
    await queryInterface.removeConstraint(
      'payments',
      'payments_patient_id_fkey'
    );

    // Then drop the patients table
    await queryInterface.dropTable('patients');
  }
};
