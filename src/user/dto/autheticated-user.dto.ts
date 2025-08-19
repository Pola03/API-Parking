import { Role } from "@prisma/client"
import { IsEnum, IsNotEmpty,IsNumber, IsString } from "class-validator"

export class AuthenticatedUserDto {
    @IsEnum(Role)
    @IsNotEmpty()
    role : Role

    @IsString()
    @IsNotEmpty()
    username : string

    @IsNumber()
    @IsNotEmpty()
    userId : number
}
