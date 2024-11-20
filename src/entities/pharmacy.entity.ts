import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany } from 'typeorm';
import { Prescription } from './prescriptions.entity.js';
@Entity()
export class Pharmacy extends BaseEntity {
   @PrimaryGeneratedColumn('uuid')
   pharmacyId!: number;

   @Column({
      type: 'varchar',
   })
   pharmacyname: string;

   @Column({
      type: 'varchar',
   })
   contact_info: string;

   @Column({
      type: 'varchar',
   })
   address: string;

   @Column({
      type: 'boolean',
   })
   delivery_supported: string;

   @OneToMany(() => Prescription, (prescription) => prescription.pharmacy)
   prescriptions: Prescription[];
}
