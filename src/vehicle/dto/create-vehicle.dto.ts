import { IsString, IsNotEmpty, IsNumber } from "class-validator"

export class CreateVehicleDto {

    @IsNumber()
    @IsNotEmpty()
    clientId : number

    @IsString()
    @IsNotEmpty()
    license_vehicle : string

    @IsString()
    @IsNotEmpty()
    model_vehicle : string

    @IsString()
    @IsNotEmpty()
    color_vehicle : string
}
