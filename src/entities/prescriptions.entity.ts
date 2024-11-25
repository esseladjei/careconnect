import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn, JoinColumn } from 'typeorm';

import { MedicalRecord } from './medicalrecord.entity.js';
import { Pharmacy } from './pharmacy.entity.js';

@Entity()
export class Prescription extends BaseEntity {
   @PrimaryGeneratedColumn('uuid')
   prescriptionId: string;

   @Column({
      type: 'varchar',
   })
   medication_name: string;

   @Column({
      type: 'varchar',
   })
   dosage: string;

   @Column({
      type: 'varchar',
   })
   frequency: string;

   @Column({
      type: 'varchar',
   })
   duration: string;

   @ManyToOne(() => MedicalRecord, (record) => record.prescriptions)
   @JoinColumn({ name: 'medicalRecordId' })
   medicalRecords: MedicalRecord;

   @ManyToOne(() => Pharmacy, (pharmacy) => pharmacy.prescriptions)
   @JoinColumn({ name: 'pharmacyId' })
   pharmacy: Pharmacy;
}
