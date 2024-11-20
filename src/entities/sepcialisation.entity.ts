import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Biodata } from './biodata.entity.js';
import { Doctor } from './doctor.entity.js';

@Entity()
export class Specialisation extends Biodata {
   @PrimaryGeneratedColumn('uuid')
   specilisationid!: number;

   @Column({
      type: 'varchar',
   })
   specialisation: string;

   @Column({
      type: 'varchar',
   })
   years_of_experience: string;

   @ManyToMany(() => Doctor)
   doctors: Doctor[];
}
