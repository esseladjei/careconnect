import {
   Entity,
   PrimaryGeneratedColumn,
   Column,
   OneToOne,
   JoinColumn,
   BaseEntity,
} from 'typeorm';

import { User } from './users.entity.ts';
@Entity()
export class Insurance extends BaseEntity {
   @PrimaryGeneratedColumn('uuid')
   insuranceid!: number;

   @Column({
      type: 'varchar',
   })
   providername: string;
   @Column({
      type: 'varchar',
   })
   policynumber: string;
   @Column({
      type: 'varchar',
   })
   coveragedetails: string;
   @Column({
      type: 'varchar',
   })
   contactinfo: string;
}
