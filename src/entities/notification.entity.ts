import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Timestamp } from 'typeorm';
import { User } from './users.entity.js';

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

   @ManyToOne(() => User, (user) => user.notifications)
   @JoinColumn({ name: 'userId' })
   user: User;
}
