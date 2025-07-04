import { ApiProperty, PartialType } from '@nestjs/swagger';

export class ProductRespDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;
  
  @ApiProperty()
  price: number;

  // @ApiProperty()
  // categoryId: string;
}

export class UpdateProductsDto extends PartialType(ProductRespDto) {}
