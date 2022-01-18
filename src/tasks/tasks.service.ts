/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFitlersDto } from './dto/get-tasks-filter.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';
import { TasksRepository } from './tasks.repository';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TasksRepository)
    private readonly tasksRepository: TasksRepository,
  ) {}

  async getTaskById(id: string, user: User): Promise<Task> {
    const task = await this.tasksRepository.findOne({ id, user });
    if (!task) {
      throw new NotFoundException('No task was found');
    }

    return task;
  }

  async getTasks(
    tasksFilterDto: GetTasksFitlersDto,
    user: User,
  ): Promise<Task[]> {
    const tasks = await this.tasksRepository.getTasks(tasksFilterDto, user);
    if (tasks.length === 0) {
      throw new NotFoundException('No tasks found');
    }
    return tasks;
  }

  createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.tasksRepository.createTask(createTaskDto, user);
  }

  async updateTask(
    id: string,
    { title, description, status }: UpdateTaskDto,
    user: User,
  ): Promise<Task> {
    const task = await this.getTaskById(id, user);
    task.title = title;
    task.description = description;
    task.status = status;
    await this.tasksRepository.save(task);
    return task;
  }

  async deleteTask(id: string, user: User): Promise<void> {
    await this.getTaskById(id, user);
    await this.tasksRepository.delete(id);
  }
}
