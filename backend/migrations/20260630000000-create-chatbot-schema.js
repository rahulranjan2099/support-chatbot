'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS pgcrypto');

    await queryInterface.createTable('faq_articles', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
        allowNull: false,
        primaryKey: true,
      },
      category: {
        type: Sequelize.STRING(120),
        allowNull: false,
      },
      question: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      answer: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    await queryInterface.addIndex('faq_articles', ['category']);
    await queryInterface.addIndex('faq_articles', ['is_active']);

    await queryInterface.bulkInsert('faq_articles', [
      {
        category: 'Shipping policy',
        question: 'How long does shipping take?',
        answer:
          'Standard shipping takes 3-5 business days. Express shipping takes 1-2 business days. Orders over $50 qualify for free standard shipping.',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        category: 'Return/refund policy',
        question: 'What is the return and refund policy?',
        answer:
          'Unused items can be returned within 30 days of delivery. Refunds are processed to the original payment method within 5-7 business days after inspection.',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        category: 'Support hours',
        question: 'When is customer support available?',
        answer:
          'Support is available Monday to Friday, 9:00 AM to 6:00 PM IST. Weekend requests are answered on the next business day.',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);

    await queryInterface.createTable('chat_sessions', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
        allowNull: false,
        primaryKey: true,
      },
      title: {
        type: Sequelize.STRING(200),
        allowNull: false,
        defaultValue: 'Customer support conversation',
      },
      status: {
        type: Sequelize.ENUM('open', 'closed'),
        allowNull: false,
        defaultValue: 'open',
      },
      customer_name: {
        type: Sequelize.STRING(120),
        allowNull: true,
      },
      customer_email: {
        type: Sequelize.STRING(180),
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    await queryInterface.addIndex('chat_sessions', ['status']);

    await queryInterface.createTable('chat_messages', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
        allowNull: false,
        primaryKey: true,
      },
      session_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'chat_sessions',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      role: {
        type: Sequelize.ENUM('user', 'assistant'),
        allowNull: false,
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      metadata: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    await queryInterface.addIndex('chat_messages', ['session_id', 'created_at']);
    await queryInterface.addIndex('chat_messages', ['role']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('chat_messages');
    await queryInterface.dropTable('chat_sessions');
    await queryInterface.dropTable('faq_articles');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_chat_messages_role"');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_chat_sessions_status"');
  },
};
