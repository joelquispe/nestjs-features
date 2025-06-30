import { ApiProperty } from "@nestjs/swagger";

export class CreateProductReqDto {
    @ApiProperty()
    name: string;

    @ApiProperty()
    description: string;

    @ApiProperty()
    price: number;

    @ApiProperty()
    categoryId: string;
}