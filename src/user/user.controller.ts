import { Controller, Get, Post, Body, Patch, Param, Delete, Put, ParseIntPipe, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt/jwt_auth.guard';
import { Roles } from '../roles/roles.decorator';
import { Role } from '@prisma/client';
import { RolesGuard } from '../roles/roles.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  
  @Roles(Role.ADMIN)
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Roles(Role.ADMIN)
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Roles(Role.EMPLOYEE, Role.ADMIN)
  @Get('client')
  findAllClients() {
    return this.userService.findAllClients();
  }

  @Roles(Role.ADMIN)
  @Get('employee')
  findAllEmployees() {
    return this.userService.findAllEmployees();
  }

  @Roles(Role.ADMIN)
  @Get('admin')
  findAllAdmins() {
    return this.userService.findAllAdmins();
  }

  @Roles(Role.ADMIN)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Roles(Role.EMPLOYEE)
  @Get('client/:id')
  findOneClient(@Param('id') id: string) {
    return this.userService.findOneClient(+id);
  }

  @Roles(Role.EMPLOYEE, Role.ADMIN, Role.CLIENT)
  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto){
    return this.userService.update(+id, updateUserDto);
  }

  @Roles(Role.ADMIN)
  @Put('promote/:id')
  promoteToAdmin(@Param('id') id : string) {
    return this.userService.promoteToAdmin(+id);
  }
  
  @Roles(Role.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }

}
