import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsNotEmpty, IsEmail, IsString, MinLength, MaxLength } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
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
