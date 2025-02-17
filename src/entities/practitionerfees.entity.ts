import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, Decimal128, ManyToOne, JoinColumn, Relation } from 'typeorm';
import { Practitioner } from './practitioner.entity.js';

@Entity()
export class PractitionerFees extends BaseEntity {
   @PrimaryGeneratedColumn('uuid')
   practitionerfeeId: string;

   @Column({
      type: 'varchar',
      length: 500,
      default: 'Diagnose disease, provide treatment, counsel patients with injuries, diseases or illnesses.',
   })
   service: string;

   @Column({
      type: 'decimal',
   })
   fee: Decimal128;

   @ManyToOne(() => Practitioner, (Practitioner) => Practitioner.fees)
   @JoinColumn({ name: 'practitionerId' })
   practitioner: Relation<Practitioner>;
}
