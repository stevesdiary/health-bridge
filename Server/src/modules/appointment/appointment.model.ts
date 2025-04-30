import { Column, Table, Model, IsUUID, DataType, Default, PrimaryKey, AllowNull, HasMany, ForeignKey, BelongsTo } from "sequelize-typescript";
import { Hospital } from '../hospital/hospital.model';
import { Doctor } from "../doctor/doctor.model";
import { Patient } from "../patient/patient.model";

export enum AppointmentStatus {
  scheduled = 'scheduled',
  completed = 'completed',
  cancelled = 'cancelled',
  pending = 'pending',
  no_show = 'no_show',
  in_progress = 'in_progress',
  rescheduled = 'rescheduled',
  waiting_list = 'waiting_list',
}

export enum Reason {
  doctor_unavalilable = 'doctor_unavailable',
  hospital_not_open = 'hospital_not_open',
  other_reasons = 'other_reasons'
}

@Table({
  tableName: 'appointments',
  timestamps: true,
  underscored: true,
  freezeTableName: true,
  paranoid: true
})
export class Appointment extends Model {
  @IsUUID(4)
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @ForeignKey(() => Patient)
  @Column({
    type: DataType.UUID,
    allowNull: false
  })
  patient_id!: string;

  @ForeignKey(() => Doctor)
  @Column({
    type: DataType.UUID,
    allowNull: false
  })
  doctor_id!: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false
  })
  reminder_sent!: boolean;

  @Column({
    type: DataType.ENUM(...Object.values(AppointmentStatus)),
    allowNull: false,
    defaultValue: 'pending'
  })
  status!: string;

  @Column({
    type: DataType.STRING
  })
  reason?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  notes?: string;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false
  })
  date!: Date

  // @Column({
  //   type: DataType.STRING
  // })
  // hospitalName!: string;
  
  // @Column({
  //   type: DataType.STRING
  // })
  // specialInstruction?:string

  // @Column({
  //   type:DataType.ENUM('virtual', 'in-person'),
  //   allowNull: true
  // })
  // consultationType?: string

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  start_time!: string;
  
  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  end_time!: string;

  @BelongsTo(() => Patient)
  patient?: Patient;

  @ForeignKey(() => Hospital)
  @Column({
    type: DataType.UUID,
    allowNull: false
  })
  hospital_id?: string

  @BelongsTo(() => Hospital)
  hospital?: Hospital;
  
  @BelongsTo(() => Doctor)
  doctor?: Doctor;
}
