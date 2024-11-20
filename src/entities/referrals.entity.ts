import { Entity, PrimaryGeneratedColumn, ManyToOne, BaseEntity } from 'typeorm';
import { Practitioner } from './practitioner.entity.js';
@Entity()
export class Referral extends BaseEntity {
   @PrimaryGeneratedColumn('uuid')
   referralId: number;
   @ManyToOne(() => Practitioner, (Practitioner) => Practitioner.receivedReferrals)
   referredDoctor: Practitioner;

   @ManyToOne(() => Practitioner, (Practitioner) => Practitioner.givenReferrals)
   referringDoctor: Practitioner;
}
