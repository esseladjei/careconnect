import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany , JoinColumn, Relation} from 'typeorm';
import { Prescription } from './prescriptions.entity.js';
@Entity()
export class Pharmacy extends BaseEntity {
   @PrimaryGeneratedColumn('uuid')
   pharmacyId: string;

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
   @JoinColumn({ name: 'prescriptionId' })
   prescriptions:Relation< Prescription[]>;
}
