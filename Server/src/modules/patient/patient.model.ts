import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
  PrimaryKey,
} from 'sequelize-typescript';
import { User } from '../user/user.model';
import { Payment } from '../payment/payment.model';
import { Appointment } from '../appointment/appointment.model';

@Table({
  tableName: 'patients',
  timestamps: true,
  paranoid: true,
  underscored: true,
  freezeTableName: true,
})
export class Patient extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false
  })
  id!: string

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    unique: true,
  })
  user_id!: string;

  @HasMany(() => Appointment)
  appointments!: Appointment[];

  @BelongsTo(() => User)
  user?: User;

  @Column({
    type: DataType.DATE
  })
  date_of_birth!: Date;

  @Column({
    type: DataType.STRING
  })
  blood_type?: string;

  @Column({
    type: DataType.TEXT,
  })
  allergies?: string;

  @Column({
    type: DataType.TEXT,
  })
  medical_history?: string;

  @Column({
    type: DataType.STRING,
  })
  emergency_contact?: string;

  @Column({
    type: DataType.STRING,
  })
  emergency_contact_phone?: string;

  @Column({
    type: DataType.STRING,
  })
  insurance_provider?: string;

  @Column({
    type: DataType.STRING,
  })
  insurance_number?: string;

  @HasMany(() => Payment)
  payments?: Payment[];
}