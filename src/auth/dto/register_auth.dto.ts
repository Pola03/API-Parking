import { PartialType } from '@nestjs/mapped-types';
import { LoginAuthDto } from './login_auth.dto';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Role } from '@prisma/client';

export class RegisterAuthDto extends PartialType(LoginAuthDto) {
    @IsEnum(Role)
    @IsNotEmpty()
    role : Role

    @IsString()
    @IsNotEmpty()
    name : string

    @IsString()
    @IsNotEmpty()
    phone : string
}
