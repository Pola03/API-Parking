import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma.service';
import { hash } from 'bcrypt';
import { Role } from '@prisma/client';

@Injectable()
export class UserService {

  constructor(private prisma:PrismaService){}

  async create(createUserDto: CreateUserDto) {
    const {password} = createUserDto;
    const plainToHash = await hash(password, 10);
    try {
      return await this.prisma.user.create({data: {...createUserDto, password: plainToHash}});
    } catch (error) {
      throw new HttpException(`Ya existe un usuario con el email ${createUserDto.email}.`, HttpStatus.BAD_REQUEST);
    }

  }

  async findAll() {
    return await this.prisma.user.findMany();
  }

  async findAllClients() {
    return await this.prisma.user.findMany({
      where: {
        role: Role.CLIENT
      },
      select: {
        id: true,
        email: true,
        phone: true,
        name: true
      }
    });
  }

  async findAllEmployees() {
    return await this.prisma.user.findMany({
      where: {
        role: Role.EMPLOYEE
      },
      select: {
        id: true,
        email: true,
        phone: true,
        name: true
      }
    });
  }

  async findAllAdmins() {
    return await this.prisma.user.findMany({
      where: {
        role: Role.ADMIN
      },
      select: {
        id: true,
        email: true,
        phone: true,
        name: true
      }
    });
  }

  async findOne(id_user: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: id_user,
      },
      select: {
        role: true,
        email: true,
        phone: true,
        name: true
      }
    });

    if (!user) {
      throw new HttpException(`El registro con ID ${id_user} no existe.`, HttpStatus.NOT_FOUND);
    }

    return user;
  }

  async findOneClient(id_user: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: id_user,
        role: Role.CLIENT
      },
      select: {
        email: true,
        phone: true,
        name: true
      }
    });

    if (!user) {
      throw new HttpException(`No existe un cliente con ID ${id_user}.`, HttpStatus.NOT_FOUND);
    }

    return user;
  }

  async update(id_user: number, updateUserDto: UpdateUserDto) {

    const {password} = updateUserDto;
    const plainToHash = await hash(password, 10);
    try {
      return await this.prisma.user.update({
        where: {
          id: id_user
        },
        data: {...updateUserDto, password: plainToHash},
        select: {
          email: true,
          phone: true,
          name: true
        }
      });
    } catch (error) {
      throw new HttpException(`O el registro con ID ${id_user} no existe o el email insertado ya existe.`, HttpStatus.NOT_FOUND);
    }
  }

  async promoteToAdmin (id_employee : number) {
    try {
      return await this.prisma.user.update({
        where: {
          id: id_employee,
          role: Role.EMPLOYEE
        },
        data: {role: Role.ADMIN},
        select: {
          email: true,
          phone: true,
          name: true, 
          role: true
        }
      });
    } catch (error) {
      throw new HttpException(`No existe un empleado con ID ${id_employee}.`, HttpStatus.NOT_FOUND);
    }
  }

  async remove(id_user: number) {
    try {
      return await this.prisma.user.delete({
        where: {
          id: id_user
        }
      });
    } catch (error) {
      throw new HttpException({ status: HttpStatus.NOT_FOUND, description: `El registro con ID ${id_user} no existe.` },
        HttpStatus.NOT_FOUND);
    }
  }
}
