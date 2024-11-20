import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import { User } from '../entities/users.entity.js';
import { Client } from '../entities/client.entity.js';
import { Practitioner } from '../entities/practitioner.entity.js';
import { PractitionerFees } from '../entities/practitionerfees.entity.js';
import { Insurance } from '../entities/insurance.entity.js';
import { Appointment } from '../entities/appointment.entity.js';
import { MedicalRecord } from '../entities/medicalrecord.entity.js';
import { Prescription } from '../entities/prescriptions.entity.js';
import { Pharmacy } from '../entities/pharmacy.entity.js';
import { ClientHealthLogs } from '../entities/clienthealthlogs.entity.js';
import { Notification } from '../entities/notification.entity.js';
import { Rating } from '../entities/rating.entity.js';
import { BillingInvoice } from '../entities/billinginvoices.entity.js';
import { VideoSession } from '../entities/videosession.entity.js';
import { Payment } from '../entities/payment.entity.js';
import { Referral } from '../entities/referrals.entity.js';
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
      Client,
      Practitioner,
      PractitionerFees,
      Insurance,
      Appointment,
      MedicalRecord,
      Prescription,
      Pharmacy,
      ClientHealthLogs,
      Notification,
      Rating,
      BillingInvoice,
      VideoSession,
      Payment,
      Referral,
   ],
});
