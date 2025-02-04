'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await queryInterface.bulkInsert('Users', [
      {
        name: 'Sam',
        email: 'sammy@email.com',
        password: 'password',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Jane',
        email: 'jane@email.com',
        password: 'password',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'John',
        email: 'johny@email.com',
        password: 'password',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Users', null, {});
  }
};
