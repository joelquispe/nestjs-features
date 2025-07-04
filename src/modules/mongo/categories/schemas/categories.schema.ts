import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ collection: 'categories' })
export class Categories {
  @Prop()
  name: string;
}

export const CategoriesSchema = SchemaFactory.createForClass(Categories);
