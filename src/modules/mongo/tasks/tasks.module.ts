import { Module } from '@nestjs/common';
import { TasksService } from './services/tasks.service';
import { TasksController } from './controllers/tasks.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Task, TaskSchema } from './schemas/tasks.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }]),
  ],
  providers: [TasksService],
  controllers: [TasksController],
})
export class TasksModule {}
