import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { User } from './entities/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async getAllTasks(): Promise<Task[]> {
    return this.tasksRepository.find({ relations: { user: true } });
  }

  async getTaskById(id: number): Promise<Task> {
    const task = await this.tasksRepository.findOne({
      where: { id },
      relations: { user: true },
    });
    if (!task) {
      throw new NotFoundException(`Задача с ID ${id} не найдена`);
    }
    return task;
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const task = this.tasksRepository.create(createTaskDto);
    return this.tasksRepository.save(task);
  }

  async createTaskWithUser(userId: number, createTaskDto: CreateTaskDto): Promise<Task> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`Пользователь с ID ${userId} не найден`);
    }
    const task = this.tasksRepository.create({ ...createTaskDto, user });
    return this.tasksRepository.save(task);
  }

  async getTasksByUser(userId: number): Promise<Task[]> {
    return this.tasksRepository.find({
      where: { userId },
      relations: { user: true },
    });
  }

  async updateTask(id: number, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const task = await this.getTaskById(id);
    Object.assign(task, updateTaskDto);
    return this.tasksRepository.save(task);
  }

  async deleteTask(id: number): Promise<void> {
    const task = await this.getTaskById(id);
    await this.tasksRepository.remove(task);
  }
}