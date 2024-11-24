import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from 'typeorm';
import { Appointment } from './appointment.entity.js';
import { ClientHealthLogs } from './clienthealthlogs.entity.js';
import { MedicalRecord } from './medicalrecord.entity.js';
import { Payment } from './payment.entity.js';
import { Practitioner } from './practitioner.entity.js';
import { User } from './users.entity.js';
@Entity()
export class Client extends BaseEntity {
   @PrimaryGeneratedColumn('uuid')
   clientid: string;

   @Column({ type: 'text', nullable: true })
   profession: string;
  
   @Column({ type: 'text', nullable: true })
   bio: string;


   @CreateDateColumn({
      type: 'timestamp',
   })
   created_at: Timestamp;

   @UpdateDateColumn({
      type: 'timestamp',
   })
   updated_at: Timestamp;

   @OneToOne(() => User)
   @JoinColumn({ name: 'userid', referencedColumnName: 'userid' })
   userId: string;

   @OneToMany(() => Appointment, (appointment) => appointment.client)
   appointments: Appointment[];

   @OneToMany(() => MedicalRecord, (record) => record.client)
   medicalRecord: MedicalRecord[];

   @ManyToMany(() => Practitioner)
   @JoinTable()
   favoritePractitioner: Practitioner[];

   @OneToMany(() => Payment, (payment) => payment.client)
   payments: Payment[];

   @OneToMany(() => ClientHealthLogs, (log) => log.client)
   healthLogs: ClientHealthLogs[];
}
