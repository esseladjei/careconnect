import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, BaseEntity } from 'typeorm';
import { Practitioner } from './practitioner.entity.js';

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

   @ManyToOne(() => Practitioner, (Practitioner) => Practitioner.ratings)
   Practitioner: Practitioner;
}
