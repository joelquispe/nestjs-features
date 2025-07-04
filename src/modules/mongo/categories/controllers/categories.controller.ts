import { Body, Controller, Get, Post } from '@nestjs/common';
import { CategoriesService } from '../services/categories.service';
import { CreateCategoryReqDto } from '../dtos/create_category_req.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Categorias')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoryService: CategoriesService) {}

  @Post()
  create(@Body() body: CreateCategoryReqDto): Promise<any> {
    return this.categoryService.create(body);
  }

  @Get()
  findAll(): Promise<any[]> {
    return this.categoryService.findAll();
  }
}
