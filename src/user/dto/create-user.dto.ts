import { Role } from "@prisma/client"
import { IsEmail, IsEnum, IsNotEmpty,IsString, MaxLength, MinLength } from "class-validator"

export class CreateUserDto {
    @IsEnum(Role)
    @IsNotEmpty()
    role : Role

    @IsNotEmpty()
    @IsEmail()
    email : string

    @IsString()
    @IsNotEmpty()
    name : string

    @IsString()
    @IsNotEmpty()
    phone : string

    @MinLength(4)
    @MaxLength(30)
    @IsString()
    password: string
}
