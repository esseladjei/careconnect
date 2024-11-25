import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity()
export class InsuranceProvider extends BaseEntity {
   @PrimaryGeneratedColumn('uuid')
   providerId: string;

   @Column({
      type: 'varchar',
   })
   providername: string;

   @Column({
     type: 'varchar',
     nullable: true,
   })
   contactinfo: string;
}
