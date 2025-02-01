import { col } from 'sequelize';
import { Table, Column, Model, DataType, IsUUID, PrimaryKey, Unique, Default, AllowNull } from 'sequelize-typescript';

@Table({
  tableName: 'providers',
  timestamps: true
})
export class Provider extends Model {
  @IsUUID(4)
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  name!: string;

  @Unique
  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  email!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  address!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  state!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  city!: string

  @Column(DataType.TIME)
  opening_time!: string

  @Column(DataType.TIME)
  closing_time!: string

  @Column(DataType.NUMBER)
  consultation_fee!: number;
  
  @Default(true)
  @Column(DataType.BOOLEAN)
  available!: boolean;

  @Default(false)
  @Column(DataType.BOOLEAN)
  verified!: boolean;
  
  @Default('provider')
  @Column(DataType.STRING)
  role!: string;
}

export interface IProviderRegistration {
  name: string;
  email: string;
  address: string;
  consultation_fee: number;
  available: boolean;
  opening_time: string;
  closing_time: string;
  role?: string;
  verified?: boolean;
}