import { Entity, PrimaryGeneratedColumn, Column, OneToMany, BaseEntity, UpdateDateColumn, CreateDateColumn } from 'typeorm';
import { Notification } from './notification.entity.js';
@Entity()
export class User extends BaseEntity {
   @PrimaryGeneratedColumn('uuid')
   userid: string;
   @Column({
      type: 'varchar',
   })
   firstname: string;

   @Column({
      type: 'varchar',
   })
   lastname: string;

   @Column({
      type: 'varchar',
      nullable: true,
   })
   othername: string;

   @Column({
      type: 'varchar',
   })
   email: string;

   @Column({
      type: 'date',
      nullable: true,
   })
   dateofbirth: Date;

   @Column({
      type: 'varchar',
      nullable: true,
   })
   gender: string;

   @Column({
      type: 'varchar',
      default: 'active',
   })
   isActive: string;

   @Column({
      type: 'varchar',
      nullable: true,
   })
   telephonenumber: string;

   @Column({
      type: 'varchar',
      nullable: true,
   })
   address: string;
   @Column({
      type: 'varchar',
   })
   password: string;

   @Column({ type: 'varchar', enum: ['Doctor', 'Nurse', 'Midwife', 'Therapist', 'Psycologist', 'Client', 'Surgeon'], default: 'Client' })
   role: 'Doctor' | 'Nurse' | 'Midwife' | 'Therapist' | 'Client' | 'Psycologist' | 'Surgeon';

   @Column({
      type: 'varchar',
      nullable: true,
   })
   profilePictureUrl: string;

   @CreateDateColumn({
      type: 'date',
   })
   created_at: Date;

   @UpdateDateColumn({
      type: 'date',
   })
   updated_at: Date;

   @OneToMany(() => User, (user) => user.notifications)
   notifications: Notification[];
}
