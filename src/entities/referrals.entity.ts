import { Entity, PrimaryGeneratedColumn, ManyToOne, BaseEntity , JoinColumn} from 'typeorm';
import { Practitioner } from './practitioner.entity.js';
@Entity()
export class Referral extends BaseEntity {
   @PrimaryGeneratedColumn('uuid')
   referralId: string;

   @ManyToOne(() => Practitioner, (Practitioner) => Practitioner.receivedReferrals)
   @JoinColumn({ name: 'receivedReferrals', referencedColumnName: 'practitionerId' })
   referredDoctor: Practitioner;

   @ManyToOne(() => Practitioner, (Practitioner) => Practitioner.givenReferrals)
   @JoinColumn({ name: 'referringDoctor', referencedColumnName: 'practitionerId' })
   referringDoctor: Practitioner;
}
