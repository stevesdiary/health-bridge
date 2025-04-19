import { 
  Table, 
  Column, 
  Model, 
  DataType, 
  ForeignKey, 
  BelongsTo, 
  HasMany 
} from 'sequelize-typescript';
import { Hospital } from '../hospital/hospital.model';
import { Appointment } from '../appointment/appointment.model';

export enum DoctorSpecialty {
  GENERAL_PRACTICE = 'GENERAL_PRACTICE',
  CARDIOLOGY = 'CARDIOLOGY',
  PEDIATRICS = 'PEDIATRICS',
  NEUROLOGY = 'NEUROLOGY',
  SURGEON = 'SURGEON',
  DENTIST = 'DENTISTRY',
  DERMATOLOGY = 'DERMATOLOGY',
  OBSTETRICS_AND_GYNECOLOGY = 'OBSTETRICS_AND_GYNECOLOGY',
  PATHOLOGY = 'PATHOLOGY',
  PSYCHIATRY = 'PSYCHIATRY',
  ALLERGY_AND_IMMUNOLOGY = 'ALLERGY_AND_IMMUNOLOGY',
  FAMILY_MEDICINE = 'FAMILY_MEDICINE',
  RADIOLOGY = 'RADIOLOGY',
  UROLOGY = 'UROLOGY'
}

@Table({
  tableName: 'doctors',
  timestamps: true,
  underscored: true,
  paranoid: true,
  freezeTableName: true
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
  first_name!: string;

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

  // @Column({
  //   type: DataType.STRING,
  //   allowNull: false
  // })
  // lisenceNumber!: string;

  @BelongsTo(() => Hospital)
  hospitals?: Hospital;

  @HasMany(() => Appointment)
  appointments!: Appointment[];
}
