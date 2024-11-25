import dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import { Appointment } from '../entities/appointment.entity.js';
import { BillingInvoice } from '../entities/billinginvoices.entity.js';
import { Client } from '../entities/client.entity.js';
import { ClientHealthLogs } from '../entities/clienthealthlogs.entity.js';
import { Insurance } from '../entities/insurance.entity.js';
import { MedicalRecord } from '../entities/medicalrecord.entity.js';
import { Notification } from '../entities/notification.entity.js';
import { Payment } from '../entities/payment.entity.js';
import { Pharmacy } from '../entities/pharmacy.entity.js';
import { Practitioner } from '../entities/practitioner.entity.js';
import { PractitionerFees } from '../entities/practitionerfees.entity.js';
import { Prescription } from '../entities/prescriptions.entity.js';
import { Rating } from '../entities/rating.entity.js';
import { Referral } from '../entities/referrals.entity.js';
import { User } from '../entities/users.entity.js';
import { VideoSession } from '../entities/videosession.entity.js';
import { Specialisation } from '@/entities/sepcialisation.entity.js';
dotenv.config();

export const AppDataSource = new DataSource({
   type: 'postgres',
   host: process.env.POSTGRES_HOST,
   port: Number(process.env.POSTGRES_PORT),
   username: process.env.POSTGRES_USER,
   password: process.env.POSTGRES_PASS,
   database: process.env.POSTGRES_DB,
   synchronize: true, // Disable in production
   logging: process.env.NODE_ENV === 'developement'?  true : false,
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
      Specialisation,
   ],
});
