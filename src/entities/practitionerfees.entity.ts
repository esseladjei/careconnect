import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, Decimal128, ManyToOne,JoinColumn } from 'typeorm';
import { Practitioner } from './practitioner.entity.js';

@Entity()
export class PractitionerFees extends BaseEntity {
   @PrimaryGeneratedColumn('uuid')
   practitionerfeeId: string;

   @Column({
      type: 'varchar',
   })
   specialisation: string;

   @Column({
      type: 'varchar',
   })
   service: string;

   @Column({
      type: 'decimal',
   })
   fee: Decimal128;

   @ManyToOne(() => Practitioner, (Practitioner) => Practitioner.fees)
   @JoinColumn({ name: 'practitionerId' })
   Practitioner: Practitioner;
}
