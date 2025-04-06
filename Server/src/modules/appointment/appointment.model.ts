import { Column, Table, Model, IsUUID, DataType, Default, PrimaryKey, AllowNull, HasMany, ForeignKey, BelongsTo } from "sequelize-typescript";
import { Hospital } from "../hospital/hospital.model";
import { Doctor } from "../doctor/doctor.model";
import { Patient } from "../patient/patient.model";

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
  patientId!: string;

  @ForeignKey(() => Doctor)
  @Column({
    type: DataType.UUID,
    allowNull: false
  })
  doctorId!: string;

  @Column({
    type: DataType.TEXT
  })
  reason?: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false
  })
  reminderSent!: boolean;

  @Column({
    type: DataType.ENUM('scheduled', 'connfirmed', 'completed', 'cancelled', 'rescheduled'),
    allowNull: false,
    defaultValue: 'scheduled'
  })
  status!: string

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  notes!: string;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false
  })
  date!: Date

  @Column({
    type: DataType.STRING
  })
  hospitalName!: string;
  
  @Column({
    type: DataType.STRING
  })
  specialInstruction?:string

  @Column({
    type:DataType.ENUM('virtual', 'in-person'),
    allowNull: true
  })
  consultationType?: string

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  startTime!: string;
  
  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  endTime!: string;

  @BelongsTo(() => Patient)
  patients!: Patient;

  @ForeignKey(() => Hospital)
  @Column({
    type: DataType.UUID,
    allowNull: false
  })
  hospitalId!: string

  @BelongsTo(() => Doctor)
  doctors!: Doctor;
}
