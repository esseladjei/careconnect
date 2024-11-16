import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@Entity()
export class User extends BaseEntity {
   @PrimaryGeneratedColumn()
   id!: number;

   @Column({
      nullable: true,
      default: '',
      type: 'varchar',
   })
   name: string = '';

   @Column({
      nullable: true,
      default: '',
      type: 'varchar',
   })
   email: string = '';
}
