import { 
  Table, 
  Column, 
  Model, 
  DataType, 
  ForeignKey, 
  BelongsTo, 
  HasMany 
} from 'sequelize-typescript';
import { Hospital } from '../../hospital/models/hospital.model';
import { Appointment } from '../../appointment/models/appointment.model';

export enum DoctorSpecialty {
  GENERAL_PRACTICE = 'GENERAL_PRACTICE',
  CARDIOLOGIST = 'CARDIOLOGIST',
  PEDIATRICS = 'PEDIATRICS',
  NEUROLOGIST = 'NEUROLOGIST',
  SURGEON = 'SURGRON',
  DENTIST = 'DENTIST',
  DERMATOLOGIST = 'DERMATOLOGIST',
  GYNECOLOGIST = 'GYNECOLOGIST'
}

@Table({
  tableName: 'doctors',
  timestamps: true
})
export class Doctor extends Model {
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
    type: DataType.STRING
  })
  phone?: string;

  @Column({
    type: DataType.STRING,
    defaultValue: 'doctor'
  })
  role?: string;

  @Column({
    type: DataType.ENUM(...Object.values(DoctorSpecialty)),
    allowNull: false
  })
  specialty?: DoctorSpecialty;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false
  })
  verified?: boolean;

  @ForeignKey(() => Hospital)
  @Column({
    type: DataType.UUID,
    allowNull: false
  })
  hospital_id?: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true
  })
  available?: boolean;

  @BelongsTo(() => Hospital)
  hospitals?: Hospital;

  @HasMany(() => Appointment)
  appointments!: Appointment[];
}
