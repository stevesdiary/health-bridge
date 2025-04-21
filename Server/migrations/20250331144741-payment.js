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
    await queryInterface.createTable('payments', {
      id: {
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        type: Sequelize.UUID
      },
      patient_id: {
        type: Sequelize.UUID,
        references: {
          model: 'patients',
          key: 'id'
        }
      },
      payment_method: {
        type: Sequelize.STRING
      },
      payment_provider: {
        type: Sequelize.STRING
      },
      appointment_id: {
        type: Sequelize.UUID,
        references: {
          model: 'appointments',
          key: 'id'
        }
      },
      currency: {
        type: Sequelize.STRING
      },
      payment_status: {
        type: Sequelize.STRING
      },
      payment_method: {
        type: Sequelize.STRING
      },
      payment_date: {
        type: Sequelize.DATE
      },
      amount: {
        type: Sequelize.INTEGER
      },
      reference: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      refund_date: {
        type: Sequelize.DATE
      },
      refund_amount: {
        type: Sequelize.INTEGER
      },
      payment_data: {
        type: Sequelize.JSON
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deleted_at: {
        type: Sequelize.DATE
      }
    })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('doctors');
  }
};
