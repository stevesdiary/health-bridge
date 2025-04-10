import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  CreatedAt,
  UpdatedAt,
  PrimaryKey,
} from 'sequelize-typescript';
import { User } from '../user/user.model';
import { Appointment } from '../appointment/appointment.model';
import { Patient } from '../patient/patient.model';

type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';
type PaymentMethod = 'credit_card' | 'debit_card' | 'bank_transfer' | 'cash' | 'POS';

@Table({
  tableName: 'payments',
  timestamps: true,
  paranoid: true,
  underscored: true,
  freezeTableName: true,
})
export class Payment extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false
  })
  id!: string;

  @ForeignKey(() => Patient)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  patientId!: string;

  @BelongsTo(() => Patient)
  patient?: Patient;

  @ForeignKey(() => Appointment)
  @Column({
    type: DataType.UUID,
    allowNull: false
  })
  appointmentId!: number;

  @BelongsTo(() => Appointment)
  appointment?: Appointment;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  amount!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: 'NGN',
  })
  currency!: string;

  @Column({
    type: DataType.ENUM('pending', 'completed', 'failed', 'refunded'),
    allowNull: false,
    defaultValue: 'pending',
  })
  paymentStatus!: PaymentStatus;

  @Column({
    type: DataType.ENUM('credit_card', 'debit_card', 'bank_transfer', 'cash', 'POS'),
    allowNull: false,
  })
  paymentMethod!: PaymentMethod;

  @Column(DataType.STRING)
  transactionId?: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  paymentDate!: Date;

  @Column({
    type: DataType.DECIMAL(10, 2),
  })
  refundAmount?: number;

  @Column(DataType.DATE)
  refundDate?: Date;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;
}