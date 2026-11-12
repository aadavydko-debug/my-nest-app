import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: false })
  completed: boolean;

  @ManyToOne(() => User, (user) => user.tasks, { nullable: true }) // ← ДОБАВИТЬ nullable: true
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ nullable: true }) // ← ИЗМЕНИТЬ: добавить nullable: true
  userId: number;
}