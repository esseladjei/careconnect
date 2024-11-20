import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import { User } from '../entities/users.entity.js';
import { Patient } from '../entities/patient.entity.js';
import { Doctor } from 'src/entities/doctor.entity.js';
import { DoctorFees } from 'src/entities/doctorfees.entity.js';
import { Insurance } from 'src/entities/insurance.entity.js';
import { Appointment } from 'src/entities/appointment.entity.js';
import { MedicalRecord } from 'src/entities/medicalrecord.entity.js';
import { Prescription } from 'src/entities/prescriptions.entity.js';
import { Pharmacy } from 'src/entities/pharmacy.entity.js';
import { PatientHealthLogs } from 'src/entities/patienthealthlogs.entity.js';
import { Notification } from 'src/entities/notification.entity.js';
import { Rating } from 'src/entities/rating.entity.js';
import { BillingInvoice } from 'src/entities/billinginvoices.entity.js';
import { VideoSession } from 'src/entities/videosession.entity.js';
import { Payment } from 'src/entities/payment.entity.js';
import { Referral } from 'src/entities/referrals.entity.js';
dotenv.config();

export const AppDataSource = new DataSource({
   type: 'postgres',
   host: process.env.POSTGRES_HOST,
   port: Number(process.env.POSTGRES_PORT),
   username: process.env.POSTGRES_USER,
   password: process.env.POSTGRES_PASS,
   database: process.env.POSTGRES_DB,
   synchronize: true, // Disable in production
   entities: [
      User,
      Patient,
      Doctor,
      DoctorFees,
      Insurance,
      Appointment,
      MedicalRecord,
      Prescription,
      Pharmacy,
      PatientHealthLogs,
      Notification,
      Rating,
      BillingInvoice,
      VideoSession,
      Payment,
      Referral,
   ],
});
