import { Type } from "class-transformer"
import { IsDate, IsNotEmpty, IsNumber, IsString } from "class-validator"

export class CreateReservationDto {
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

    @IsNumber()
    @IsNotEmpty()
    placeId: number
}
