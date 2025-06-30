import { ApiProperty } from "@nestjs/swagger";

export class CategoryRespDto{
    @ApiProperty()
    id: string;
    
    @ApiProperty()
    name: string;
}