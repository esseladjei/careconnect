import {
   Entity,
   Column,
   BaseEntity,
   CreateDateColumn,
   UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Biodata extends BaseEntity {
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
}
