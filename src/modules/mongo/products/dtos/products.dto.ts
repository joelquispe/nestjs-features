import { PartialType } from '@nestjs/swagger';

export class CreateProductsDto {
  name: string;
  description: string;
  price: number;
}

export class UpdateProductsDto extends PartialType(CreateProductsDto) {}
