import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { Task } from './task.entity';
import { Role } from './role.entity'; // ← ДОБАВИТЬ

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Task, (task) => task.user)
  tasks: Task[];

  @ManyToMany(() => Role, (role) => role.users)
  @JoinTable() // ← ДОБАВИТЬ: создает связующую таблицу user_roles
  roles: Role[];
}