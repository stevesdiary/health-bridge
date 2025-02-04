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
    await queryInterface.createTable('appointments', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4
      },
      user_id: {
        type: Sequelize.STRING,
        allowNull: false
      },
      provider_id: {
        type: Sequelize.STRING,
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM(['completed', 'scheduled', 'cancelled']),
        allowNull: false,
        defaultValue: 'scheduled',
        comment: 'Current appointment state'
      },
      reminder_sent: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Flag if reminder notification was sent'
      },
      notes: {
        type: Sequelize.STRING,
        allowNull: true,
        validate: {
          len: [0, 500]
        }
      },
      date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
        validate: {
          isAfter: new Date().toISOString().split('T')[0]
        }
      },
      time: {
        type: Sequelize.TIME,
        allowNull: false
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
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
    await queryInterface.dropTable('appointments')
  }
};
