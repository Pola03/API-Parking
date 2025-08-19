import { Controller, Get, Post, Body, Param, Delete, Put, Request, UseGuards } from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { Roles } from '../roles/roles.decorator';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt/jwt_auth.guard';
import { RolesGuard } from '../roles/roles.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('vehicle')
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @Roles(Role.EMPLOYEE, Role.ADMIN, Role.CLIENT)
  @Post()
  create(@Body() createVehicleDto: CreateVehicleDto) {
    return this.vehicleService.create(createVehicleDto);
  }

  @Roles(Role.EMPLOYEE, Role.ADMIN)
  @Get()
  findAll() {
    return this.vehicleService.findAll();
  }

  @Roles(Role.CLIENT)
  @Get('client/:id')
  findAllClientVehicle (@Param('id') id : string) {
    return this.vehicleService.findAllClientVehicle(+id);
  }

  @Roles(Role.EMPLOYEE, Role.ADMIN)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vehicleService.findOne(+id);
  }

  @Roles(Role.CLIENT, Role.ADMIN)
  @Put(':id')
  update(@Param('id') id: string, @Body() updateVehicleDto: UpdateVehicleDto, @Request() req : any) {
    return this.vehicleService.update(+id, updateVehicleDto, req.user);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vehicleService.remove(+id);
  }
}
