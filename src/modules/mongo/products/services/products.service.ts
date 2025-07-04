import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from '../schemas/products.schema';
import { Model } from 'mongoose';
import { CreateProductReqDto } from '../dtos/create_product_req.dto';
import { ProductRespDto } from '../dtos/product_resp.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
  ) {}

  async create(body: CreateProductReqDto): Promise<any> {
    const product = new this.productModel(body);
    const { _id, name, price, description } = await product.save();
    return {
      id: _id.toString(),
      name,
      price,
      description,
    };
  }

  async findAll(): Promise<ProductRespDto[]> {
    const result = await this.productModel.find().lean();
    console.log(result);
    return result.map((value) => ({
      id: value._id.toString(),
      name: value.name,
      description: value.description,
      price: value.price,
      // categoryId: value.categories.toString(),
    }));
  }

  async getByPage(page: number, limit: number){
    const data = await this.productModel.find().skip((page - 1) * limit).limit(limit);
    return data.map((value) => ({
      id: value._id.toString(),
      name: value.name,
      description: value.description,
      price: value.price,
      // categoryId: value.categories._id.toString(),
    }));
  }
}
