import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards, Query, Request } from '@nestjs/common';
import { ParkingSpaceService } from './parking_space.service';
import { UpdateParkingSpaceDto } from './dto/update-parking_space.dto';
import { Roles } from '../roles/roles.decorator';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt/jwt_auth.guard';
import { RolesGuard } from '../roles/roles.guard';
import { ValidateUpdateEntryPipe } from './pipes/validate_update_entry/validate_update_entry.pipe';
import { ValidateUpdateExitPipe } from './pipes/validate_update_exit/validate_update_exit.pipe';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('parking-space')
export class ParkingSpaceController {
  constructor(private readonly parkingSpaceService: ParkingSpaceService) {}

  @Roles(Role.ADMIN)
  @Post(':amount')
  create(@Param('amount') amount: string) {
    return this.parkingSpaceService.create(+amount);
  }

  @Roles(Role.EMPLOYEE, Role.ADMIN, Role.CLIENT)
  @Get()
  findAll() {
    return this.parkingSpaceService.findAll();
  }

  @Roles(Role.EMPLOYEE, Role.ADMIN)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.parkingSpaceService.findOne(+id);
  }

  @Roles(Role.EMPLOYEE, Role.ADMIN)
  @Put('entry')
  updateEntry(@Query(ValidateUpdateEntryPipe) query : {id: number, is_entry : boolean}, @Body() updateParkingSpaceDto: UpdateParkingSpaceDto, @Request() req : any) {
    return this.parkingSpaceService.updateEntry(+(query.id), updateParkingSpaceDto, query.is_entry, req.user);
  }

  @Roles(Role.EMPLOYEE, Role.ADMIN)
  @Put('exit')
  updateExit(@Query(ValidateUpdateExitPipe) query : {id: number, date_exit : Date}, @Request() req : any) {
    return this.parkingSpaceService.updateExit(+(query.id), req.user, query.date_exit);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.parkingSpaceService.remove(+id);
  }

}
