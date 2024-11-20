import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, Decimal128, ManyToOne } from 'typeorm';
import { Practitioner } from './practitioner.entity.js';

@Entity()
export class PractitionerFees extends BaseEntity {
   @PrimaryGeneratedColumn('uuid')
   practitionerfeeid!: number;

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
   Practitioner: Practitioner;
}
