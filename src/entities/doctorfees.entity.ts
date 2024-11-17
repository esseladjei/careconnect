import {
   Entity,
   PrimaryGeneratedColumn,
   Column,
   BaseEntity,
   Decimal128,
   ManyToOne,
} from 'typeorm';
import { Doctor } from './doctor.entity.ts';

@Entity()
export class DoctorFees extends BaseEntity {
   @PrimaryGeneratedColumn('uuid')
   doctorfeeid!: number;

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

   @ManyToOne(() => Doctor, (doctor) => doctor.fees)
   doctor: Doctor;
}
