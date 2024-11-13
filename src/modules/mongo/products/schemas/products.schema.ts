import { Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Categories } from '../../categories/schemas/categories.schema';

export type ProductDocument = HydratedDocument<Product>;

export class Product {
  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  price: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Categories' })
  categories: Categories;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
