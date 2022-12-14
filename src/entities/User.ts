import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity ()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({length: 100})
    name!: string;

    @Column({length: 100})
    password!: string;

    @Column({length: 100})
    salt!: string;

}
