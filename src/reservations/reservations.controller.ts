import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards, Request, Query } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { Roles } from '../roles/roles.decorator';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt/jwt_auth.guard';
import { RolesGuard } from '../roles/roles.guard';
import { DeleteReservationPipe } from './pipes/delete_reservation/delete_reservation.pipe';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post()
  @Roles(Role.CLIENT, Role.ADMIN)
  create(@Body() createReservationDto: CreateReservationDto, @Request() req : any) {
    return this.reservationsService.create(createReservationDto, req.user);
  }

  @Roles(Role.EMPLOYEE, Role.ADMIN)
  @Get()
  findAll() {
    return this.reservationsService.findAll();
  }

  @Roles(Role.EMPLOYEE, Role.ADMIN)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reservationsService.findOne(+id);
  }

  @Roles(Role.EMPLOYEE, Role.ADMIN)
  @Put(':id')
  update(@Param('id') id: string, @Body() updateReservationDto: UpdateReservationDto) {
    return this.reservationsService.update(+id, updateReservationDto);
  }

  @Roles(Role.EMPLOYEE, Role.ADMIN)
  @Delete()
  remove(@Query(DeleteReservationPipe) query: {id: number, is_cancellation: boolean}, @Request() req : any) {
    return this.reservationsService.remove(+(query.id), req.user, query.is_cancellation);
  }
}
