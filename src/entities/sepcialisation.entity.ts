import { BaseEntity, Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Practitioner } from './practitioner.entity.js';

@Entity()
export class Specialisation extends BaseEntity {
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

   @ManyToMany(() => Practitioner)
   doctors: Practitioner[];
}
