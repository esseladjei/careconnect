import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Biodata } from './biodata.entity.js';
import { Role } from 'src/types/entity.types.js';
import { Notification } from './notification.entity.js';
@Entity()
export class User extends Biodata {
   @PrimaryGeneratedColumn('uuid')
   userid: string;

   @Column({
      type: 'varchar',
   })
   password: string;

   @Column({
      type: 'enum',
      enum: Role,
      nullable: true,
   })
   role: Role;

   @OneToMany(() => User, (user) => user.notifications)
   notifications: Notification[];
}
