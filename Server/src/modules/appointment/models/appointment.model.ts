import { Column, Table, Model, IsUUID, DataType, Default, PrimaryKey, AllowNull, HasMany, ForeignKey, BelongsTo } from "sequelize-typescript";
import { User } from "../../user/models/user.model";
import { Hospital } from "../../hospital/models/hospital.model";
import { Doctor } from "../../doctor/model/doctor.model";

@Table({
  tableName: 'appointments',
  timestamps: true
})
export class Appointment extends Model {
  @IsUUID(4)
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  user_id!: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false
  })
  reminder_sent!: boolean;

  @Column({
    type: DataType.ENUM('scheduled', 'completed', 'cancelled'),
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
    type: DataType.STRING,
    allowNull: false
  })
  start_time!: string;
  
  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  end_time!: string;

  @BelongsTo(() => User)
  user!: User

  @ForeignKey(() => Doctor)  // Add this decorator
  @Column({
    type: DataType.UUID,
    allowNull: false
  })
  doctor_id!: string;

  @ForeignKey(() => Hospital)
  @Column({
    type: DataType.UUID,
    allowNull: false
  })
  hospital_id!: string

  @BelongsTo(() => Doctor)
  doctors!: Doctor;
}
