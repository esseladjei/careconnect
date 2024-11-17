import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import { User } from '../entities/users.entity.ts';
import { Patient } from '../entities/patient.entity.ts';
import { Doctor } from 'src/entities/doctor.entity.ts';
import { DoctorFees } from 'src/entities/doctorfees.entity.ts';
import { Insurance } from 'src/entities/insurance.entity.ts';
import { Appointment } from 'src/entities/appointment.entity.ts';
import { MedicalRecord } from 'src/entities/medicalrecord.entity.ts';
import { Prescription } from 'src/entities/prescriptions.entity.ts';
import { Pharmacy } from 'src/entities/pharmacy.entity.ts';
import { PatientHealthLogs } from 'src/entities/patienthealthlogs.entity.ts';
import { Notification } from 'src/entities/notification.entity.ts';
import { Rating } from 'src/entities/rating.entity.ts';
import { BillingInvoice } from 'src/entities/billinginvoices.entity.ts';
import { VideoSession } from 'src/entities/videosession.entity.ts';
import { Payment } from 'src/entities/payment.entity.ts';
import { Referral } from 'src/entities/referrals.entity.ts';
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
