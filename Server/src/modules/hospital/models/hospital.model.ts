// src/models/hospital.model.ts
import { 
  Table, 
  Column, 
  Model, 
  DataType, 
  HasMany 
} from 'sequelize-typescript';
import { Doctor } from '../../doctor/model/doctor.model';

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

  // Relationships
  @HasMany(() => Doctor)
  doctors?: Doctor[];
}



// import { Table, Column, Model, DataType, IsUUID, PrimaryKey, Unique, Default, AllowNull } from 'sequelize-typescript';

// @Table({
//   tableName: 'hospitals',
//   timestamps: true
// })
// export class Hospital extends Model {
//   @IsUUID(4)
//   @PrimaryKey
//   @Default(DataType.UUIDV4)
//   @Column(DataType.UUID)
//   id!: string;

//   @Column({
//     type: DataType.STRING,
//     allowNull: false
//   })
//   name!: string;

//   @Unique
//   @Column({
//     type: DataType.STRING,
//     allowNull: false
//   })
//   email!: string;

//   @Column({
//     type: DataType.STRING,
//     allowNull: false
//   })
//   address!: string;

//   @Column({
//     type: DataType.STRING,
//     allowNull: false
//   })
//   state!: string;

//   @Column({
//     type: DataType.STRING,
//     allowNull: false
//   })
//   city!: string

//   @Column(DataType.TIME)
//   opening_time!: string

//   @Column(DataType.TIME)
//   closing_time!: string

//   @Column(DataType.NUMBER)
//   consultation_fee!: number;
  
//   @Default(true)
//   @Column(DataType.BOOLEAN)
//   available!: boolean;

//   @Default(false)
//   @Column(DataType.BOOLEAN)
//   verified!: boolean;
  
//   @Default('hospital')
//   @Column(DataType.STRING)
//   role!: string;
// }

// export interface IProviderRegistration {
//   name: string;
//   email: string;
//   address: string;
//   consultation_fee: number;
//   available: boolean;
//   opening_time: string;
//   closing_time: string;
//   role?: string;
//   verified?: boolean;
// }