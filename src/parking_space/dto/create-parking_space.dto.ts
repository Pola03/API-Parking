import { Type } from "class-transformer"
import { IsDate, IsNotEmpty, IsNumber, MinLength} from "class-validator"

export class CreateParkingSpaceDto {
   
    @IsDate()
    @IsNotEmpty()
    @Type(() => Date)
    init_dateTime : Date

    @IsDate()
    @IsNotEmpty()
    @Type(() => Date)
    end_dateTime : Date

    @IsNumber()
    @IsNotEmpty()
    clientId: number

    @IsNumber()
    @IsNotEmpty()
    vehicleId: number
}
