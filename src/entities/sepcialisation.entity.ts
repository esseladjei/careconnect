import { BaseEntity, Column, Entity, ManyToMany, PrimaryGeneratedColumn, Relation } from 'typeorm';
import { Practitioner } from './practitioner.entity.js';

@Entity()
export class Specialisation extends BaseEntity {
   @PrimaryGeneratedColumn('uuid')
   specialisationId: string;

   @Column({
      type: 'varchar',
      default: 'General Doctor',
   })
   name: string;

   @ManyToMany(() => Practitioner, (practitioner) => practitioner.specialisations)
   practitioners:Relation< Practitioner[]>;
}
