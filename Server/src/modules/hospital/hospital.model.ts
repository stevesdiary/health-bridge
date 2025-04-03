import { 
  Table, 
  Column, 
  Model, 
  DataType, 
  HasMany 
} from 'sequelize-typescript';
import { Doctor } from '../doctor/doctor.model';

@Table({
  tableName: 'hospitals',
  timestamps: true
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
}
