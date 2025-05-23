import { 
  Table, 
  Column, 
  Model, 
  DataType, 
  HasMany 
} from 'sequelize-typescript';
import { Doctor } from '../doctor/doctor.model';
import { Appointment } from '../appointment/appointment.model';

@Table({
  tableName: 'hospitals',
  timestamps: true,
  underscored: true,
  paranoid: true,
  freezeTableName: true,
})
export class Hospital extends Model {
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
  name?: string;

  @Column({
    type: DataType.STRING
  })
  address?: string;
  
  // @Column({
  //   type: DataType.STRING,
  //   allowNull: false
  // })
  // state?: string;

  // @Column({
  //   type: DataType.STRING,
  //   allowNull: false
  // })
  // city?: string

  @Column({
    type: DataType.STRING
  })
  phone?: string;

  @Column({
    type: DataType.STRING
  })
  email?: string;

  @Column({
    type: DataType.TEXT
  })
  description?: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true
  })
  open?: boolean;

  @Column({
    type: DataType.INTEGER
  })
  rating?: number

  // @Column({
  //   type: DataType.STRING
  // })
  // services?: string[]

  // Relationships
  @HasMany(() => Doctor)
  doctors?: Doctor[];

  @HasMany(() => Appointment)
  appointments?: Appointment[];

  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW
  })
  created_at?: Date;

  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW
  })
  updated_at?: Date;
  
  @Column({
    type: DataType.DATE
  })
  deleted_at?: Date;
}
