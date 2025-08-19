import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LoginAuthDto } from './dto/login_auth.dto';
import { RegisterAuthDto } from './dto/register_auth.dto';
import { PrismaService } from '../prisma.service';
import { compare, hash } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

  constructor(private prisma : PrismaService, private jwtService : JwtService){}
  
  async register(userObject: RegisterAuthDto) {
    const {password} = userObject;
    const plainToHash = await hash(password, 10);

    return await this.prisma.user.create({data:{...userObject, email: userObject.email, password: plainToHash}});
  }

  async login(userObject: LoginAuthDto) {
    const {email, password} = userObject;
    const findUser = await this.prisma.user.findUnique({
      where: {
        email: email
      }
    });
    if(!findUser){
      throw new HttpException(`No existe un usuario con el email ${email}.`, HttpStatus.UNAUTHORIZED);
    }

    const checkPassword = await compare(password, findUser.password);
    if(!checkPassword){
      throw new HttpException('La contraseña es incorrecta.', HttpStatus.UNAUTHORIZED);
    }
    
    const payload = {id: findUser.id, name: findUser.name, role: findUser.role};
    const token = this.jwtService.sign(payload);
    const data = {
      user: findUser,
      token
    };

    return data;
  }
}
