import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';
import { sequelize } from '../database';

export class ChatSession extends Model<InferAttributes<ChatSession>, InferCreationAttributes<ChatSession>> {
  declare id: CreationOptional<string>;
  declare title: string;
  declare status: CreationOptional<'open' | 'closed'>;
  declare customerName: CreationOptional<string | null>;
  declare customerEmail: CreationOptional<string | null>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

ChatSession.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
      defaultValue: 'Customer support conversation',
    },
    status: {
      type: DataTypes.ENUM('open', 'closed'),
      allowNull: false,
      defaultValue: 'open',
    },
    customerName: {
      type: DataTypes.STRING(120),
      allowNull: true,
      field: 'customer_name',
    },
    customerEmail: {
      type: DataTypes.STRING(180),
      allowNull: true,
      field: 'customer_email',
      validate: {
        isEmail: true,
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'created_at',
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'updated_at',
    },
  },
  {
    sequelize,
    tableName: 'chat_sessions',
    indexes: [{ fields: ['status'] }],
  }
);
