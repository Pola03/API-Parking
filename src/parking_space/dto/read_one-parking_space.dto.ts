import { IsNotEmpty, IsNumber} from "class-validator"

export class ReadOneParkingSpaceDto {
   
    @IsNumber()
    @IsNotEmpty()
    clientId: number

    @IsNumber()
    @IsNotEmpty()
    vehicleId: number
}
