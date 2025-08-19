import { IsEmail, IsNotEmpty, MaxLength, MinLength } from "class-validator";

export class LoginAuthDto {
    @IsEmail()
    @IsNotEmpty()
    email: string

    @MinLength(4)
    @MaxLength(30)
    password: string
}
