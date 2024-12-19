import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Relation, Timestamp } from 'typeorm';
import { Practitioner } from './practitioner.entity.js';

@Entity()
export class Notification extends BaseEntity {
   @PrimaryGeneratedColumn('uuid')
   notificationId: string;

   @Column({
      type: 'varchar',
   })
   message: string;

   @Column({
      type: 'timestamp',
   })
   notification_date: Timestamp;

   @Column({
      type: 'varchar',
   })
   type: string;

   @Column({
      type: 'varchar',
   })
   status: string;

   @ManyToOne(() => Practitioner, (practioner) => practioner.notifications)
   @JoinColumn({ name: 'practitionerId' })
   practioner: Relation< Practitioner>;
}
