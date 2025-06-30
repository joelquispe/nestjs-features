import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Categories } from '../schemas/categories.schema';
import { Model } from 'mongoose';
import { CreateCategoryReqDto } from '../dtos/create_category_req.dto';
import { CategoryRespDto } from '../dtos/category_resp.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Categories.name)
    private readonly categoriesModel: Model<Categories>,
  ) {}

  async create(body: CreateCategoryReqDto): Promise<CategoryRespDto> {
    const category = new this.categoriesModel(body);
    const result = await category.save();
    const { _id, name } = result;
    return {
      id: _id.toString(),
      name: name,
    };
  }

  async findAll(): Promise<CategoryRespDto[]> {
    const data = await this.categoriesModel.find().lean();
    return data.map(
      (value) =>
        ({
          id: value._id.toString(),
          name: value.name,
        }) as CategoryRespDto,
    );
  }
}
