import { Table, Column, Model, DataType, IsUUID, PrimaryKey, Unique, Default, HasMany } from 'sequelize-typescript';
import { Appointment } from '../../appointment/models/appointment.model';

@Table({
  tableName: 'users',
  timestamps: true
})
export class User extends Model {
  @IsUUID(4)
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  name!: string;

  @Unique
  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  email!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  user_id!: string;
  
  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  password!: string;

  @Default('user')
  @Column(DataType.STRING)
  role!: string;

  @Default(false)
  @Column(DataType.BOOLEAN)
  verified!: boolean;

  @HasMany(() => Appointment)
  appointments!: Appointment[];
}

export interface IUserRegistration {
  name: string;
  email: string;
  password: string;
  role?: string;
  verified?: boolean;
}
