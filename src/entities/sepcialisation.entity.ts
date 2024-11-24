import { BaseEntity, Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Practitioner } from './practitioner.entity.js';

@Entity()
export class Specialisation extends BaseEntity {
   @PrimaryGeneratedColumn('uuid')
   specilisationId: string;

   @Column({
      type: 'varchar',
      default: 'General Doctor', // e.g., Cardiology, Dermatology
   })
   name: string;

   @Column({
      type: 'varchar',
   })
   years_of_experience: string;

   @ManyToMany(() => Practitioner, (practitioner) => practitioner.specialisations)
   practitioners: Practitioner[];
}
