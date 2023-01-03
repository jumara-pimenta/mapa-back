import { ApiProperty } from "@nestjs/swagger";

export class FiltersEmployeesOnPathDTO {
    @ApiProperty({required: false})
    boardingAt?: Date;
    @ApiProperty({required: false})
    confirmation?: boolean;
    @ApiProperty({required: false})
    disembarkAt?: Date;
    @ApiProperty({required: false})
    employeeId?: string;
    @ApiProperty({required: false})
    pathId?: string;
    @ApiProperty({required: false})
    position?: number;
}
