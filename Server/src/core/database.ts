import dotenv from 'dotenv';
dotenv.config();
import { Sequelize } from 'sequelize-typescript';
import { User } from '../modules/user/user.model';
import { Appointment } from '../modules/appointment/appointment.model';
import { Hospital } from '../modules/hospital/hospital.model';
import { Doctor } from '../modules/doctor/doctor.model';
import { Patient } from '../modules/patient/patient.model';
import { Payment } from '../modules/payment/payment.model';

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'your_database',
  models: [User, Appointment, Hospital, Doctor, Patient, Payment],
});

export default sequelize;
