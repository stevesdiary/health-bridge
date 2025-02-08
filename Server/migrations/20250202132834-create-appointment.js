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
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
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
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
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
