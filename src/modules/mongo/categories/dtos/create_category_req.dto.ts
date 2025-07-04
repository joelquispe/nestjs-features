import { ApiProperty } from "@nestjs/swagger";

export class CreateCategoryReqDto {
    @ApiProperty()
    name: string;
}