import { Type } from "class-transformer"
import { IsDate, IsNotEmpty, IsNumber } from "class-validator"

export class UpdateExitParkingSpaceDto {

    @IsNumber()
    @IsNotEmpty()
    id: number

    @IsDate()
    @IsNotEmpty()
    @Type(() => Date)
    date_exit : Date
}
