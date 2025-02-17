import { Entity, PrimaryGeneratedColumn, ManyToOne, BaseEntity , JoinColumn, Relation} from 'typeorm';
import { Practitioner } from './practitioner.entity.js';
@Entity()
export class Referral extends BaseEntity {
   @PrimaryGeneratedColumn('uuid')
   referralId: string;

   @ManyToOne(() => Practitioner, (Practitioner) => Practitioner.receivedReferrals)
   @JoinColumn({ name: 'receivedReferrals', referencedColumnName: 'practitionerId' })
   referredDoctor: Relation< Practitioner>;

   @ManyToOne(() => Practitioner, (Practitioner) => Practitioner.givenReferrals)
   @JoinColumn({ name: 'referringDoctor', referencedColumnName: 'practitionerId' })
   referringDoctor:Relation< Practitioner>;
}
