import { Column, Table, Model, IsUUID, DataType, Default, PrimaryKey, AllowNull, HasMany, ForeignKey, BelongsTo } from "sequelize-typescript";
import { User } from "../../user/models/user.model";
import { Provider } from "../../provider/models/provider.model";

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
    allowNull: false
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
  time!: string;

  @BelongsTo(() => User)
  user!: User


  @ForeignKey(() => Provider)
  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  provider_id!: string
}

// export interface IAppointment {
//   name: string;
//   email: string;

// }