import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from '../schemas/products.schema';
import { Model } from 'mongoose';
import { CreateProductsDto } from '../dtos/products.dto';
@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  save(product: CreateProductsDto) {
    const newData = new this.productModel(product);
    return newData;
  }
}
