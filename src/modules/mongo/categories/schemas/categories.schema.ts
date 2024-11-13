import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TaskDocument = HydratedDocument<Categories>;

@Schema()
export class Categories {
  @Prop()
  name: string;
}

export const CategoriesSchema = SchemaFactory.createForClass(Categories);
