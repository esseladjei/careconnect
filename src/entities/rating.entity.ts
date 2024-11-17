import {
   Entity,
   PrimaryGeneratedColumn,
   Column,
   ManyToOne,
   BaseEntity,
} from 'typeorm';
import { Doctor } from './doctor.entity.ts';

@Entity()
export class Rating extends BaseEntity {
   @PrimaryGeneratedColumn('uuid')
   ratingId!: number;

   @Column({
      type: 'varchar',
   })
   rating: string;

   @Column({
      type: 'varchar',
   })
   review_note: string;

   @Column({
      type: 'date',
   })
   date: Date;

   @ManyToOne(() => Doctor, (doctor) => doctor.ratings)
   doctor: Doctor;
}
