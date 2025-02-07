import { 
  Table, 
  Column, 
  Model, 
  DataType, 
  HasMany
} from 'sequelize-typescript';
import { Appointment } from '../../appointment/models/appointment.model';

export enum UserRole {
  PATIENT = 'PATIENT',
  ADMIN = 'ADMIN',
  STAFF = 'STAFF'
}

@Table({
  tableName: 'users',
  timestamps: true
})
export class User extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true
  })
  id?: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  first_name?: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  last_name?: string;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false
  })
  email?: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  password?: string;

  @Column({
    type: DataType.ENUM(...Object.values(UserRole)),
    defaultValue: UserRole.PATIENT
  })
  role?: UserRole;

  @Column({
    type: DataType.STRING
  })
  phone?: string;

  @Column({
    type: DataType.DATE
  })
  date_of_birth?: Date;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false
  })
  verified?: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true
  })
  is_active?: boolean;

  @HasMany(() => Appointment)
  appointments?: Appointment[];
}
