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
        'payments_appointment_id_fkey'
      );
    }

    // Now create the appointments table
    await queryInterface.createTable('appointments', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4
      },
      patient_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'patients',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false
      },
      reminder_sent: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      notes: {
        type: Sequelize.STRING,
        allowNull: true,
        validate: {
          len: [0, 500]
        }
      },
      reason: {
        type: Sequelize.STRING
      },
      date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
        validate: {
          isAfter: new Date().toISOString().split('T')[0]
        }
      },
      start_time: {
        type: Sequelize.STRING,
        allowNull: false
      },
      end_time: {
        type: Sequelize.STRING,
        allowNull: false
      },
      doctor_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'doctors',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      hospital_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'hospitals',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
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

    // Add the foreign key constraint back to the payments table if it exists
    if (paymentsTableExists) {
      await queryInterface.addConstraint('payments', {
        fields: ['appointment_id'],
        type: 'foreign key',
        name: 'payments_appointment_id_fkey',
        references: {
          table: 'appointments',
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
      'payments_appointment_id_fkey'
    );

    // Then drop the appointments table
    await queryInterface.dropTable('appointments');
  }
};
