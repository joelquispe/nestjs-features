import { Module } from '@nestjs/common';
import { CategoriesService } from './services/categories.service';
import { CategoriesController } from './controllers/categories.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Categories, CategoriesSchema } from './schemas/categories.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Categories.name, schema: CategoriesSchema },
    ]),
  ],
  providers: [CategoriesService],
  controllers: [CategoriesController],
})
export class CategoriesModule {}
