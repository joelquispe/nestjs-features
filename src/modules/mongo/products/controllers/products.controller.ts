import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ProductsService } from '../services/products.service';
import { ProductRespDto } from '../dtos/product_resp.dto';
import { CreateProductReqDto } from '../dtos/create_product_req.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Productos')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() body: CreateProductReqDto): Promise<ProductRespDto> {
    return this.productsService.create(body);
  }

  @Get()
  findAll(): Promise<ProductRespDto[]> {
    return this.productsService.findAll();
  }

  @Get('get-by-page')
  getByPage(
    @Query('page') page: number,
    @Query('limit') limit: number,
  ): Promise<ProductRespDto[]> {
    return this.productsService.getByPage(page, limit);
  }
}
