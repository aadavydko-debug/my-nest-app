import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard'; // ← ДОБАВИТЬ
import { Roles } from '../auth/decorators/roles.decorator'; // ← ДОБАВИТЬ
import { TasksService } from './tasks.service';
import type { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard) // ← ДОБАВИТЬ RolesGuard
  @Roles('admin', 'user') // ← ДОБАВИТЬ: доступ только для admin и user
  async getAllTasks(): Promise<Task[]> {
    return this.tasksService.getAllTasks();
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin', 'user')
  async getTaskById(@Param('id', ParseIntPipe) id: number): Promise<Task> {
    return this.tasksService.getTaskById(id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin') // ← ТОЛЬКО admin может создавать задачи
  async createTask(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return this.tasksService.createTask(createTaskDto);
  }

  @Post('user/:userId')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  async createTaskForUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() createTaskDto: CreateTaskDto,
  ): Promise<Task> {
    return this.tasksService.createTaskWithUser(userId, createTaskDto);
  }

  @Get('user/:userId')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin', 'user')
  async getTasksByUser(@Param('userId', ParseIntPipe) userId: number): Promise<Task[]> {
    return this.tasksService.getTasksByUser(userId);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin') // ← ТОЛЬКО admin может обновлять
  async updateTask(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    return this.tasksService.updateTask(id, updateTaskDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin') // ← ТОЛЬКО admin может удалять
  async deleteTask(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    await this.tasksService.deleteTask(id);
    return { message: `Задача с ID ${id} успешно удалена` };
  }
}