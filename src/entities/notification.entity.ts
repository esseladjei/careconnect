import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, BaseEntity, Timestamp } from 'typeorm';
import { User } from './users.entity.js';

@Entity()
export class Notification extends BaseEntity {
   @PrimaryGeneratedColumn('uuid')
   notificationId!: number;

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

   @ManyToOne(() => User, (user) => user.notifications)
   user: User;
}
