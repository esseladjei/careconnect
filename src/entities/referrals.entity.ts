import { Entity, PrimaryGeneratedColumn, ManyToOne, BaseEntity } from 'typeorm';
import { Doctor } from './doctor.entity.ts';
@Entity()
export class Referral extends BaseEntity {
   @PrimaryGeneratedColumn('uuid')
   referralId: number;
   @ManyToOne(() => Doctor, (doctor) => doctor.receivedReferrals)
   referredDoctor: Doctor;

   @ManyToOne(() => Doctor, (doctor) => doctor.givenReferrals)
   referringDoctor: Doctor;
}
