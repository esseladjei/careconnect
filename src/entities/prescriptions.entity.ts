import {
   Entity,
   PrimaryGeneratedColumn,
   Column,
   OneToOne,
   JoinColumn,
   BaseEntity,
   ManyToOne,
   ManyToMany,
   JoinTable,
} from 'typeorm';

import { MedicalRecord } from './medicalrecord.entity.ts';
import { Pharmacy } from './pharmacy.entity.ts';
import { Specialisation } from './sepcialisation.entity.ts';

@Entity()
export class Prescription extends BaseEntity {
   @PrimaryGeneratedColumn('uuid')
   prescriptionId!: number;

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
   medicalRecord: MedicalRecord;

   @ManyToOne(() => Pharmacy, (pharmacy) => pharmacy.prescriptions)
   pharmacy: Pharmacy;
}
