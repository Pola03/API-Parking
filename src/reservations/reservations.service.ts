import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { PrismaService } from '../prisma.service';
import { LogsService } from '../logs/logs.service';
import { AuthenticatedUserDto } from '../user/dto/autheticated-user.dto';
import { Role } from '@prisma/client';

@Injectable()
export class ReservationsService {

  constructor( private prisma:PrismaService,
               private logsService : LogsService){}

  async create(reservation: CreateReservationDto, authenticated_user : AuthenticatedUserDto) {

    //Verificaciones
    if(reservation.end_dateTime < reservation.init_dateTime){
      throw new HttpException('La fecha final no puede ser menor que la fecha inicial.', HttpStatus.BAD_REQUEST);
    }
    const client = await this.prisma.user.findUnique({
      where: {
        id: reservation.clientId,
        role: Role.CLIENT
      },
      select: {
        name: true
      }
    });
    if(!client) throw new HttpException(`No existe un cliente con ID ${reservation.clientId}.`, HttpStatus.BAD_REQUEST);

    const vehicle = await this.prisma.vehicle.findUnique({
      where: {
        id: reservation.vehicleId
      }
    });
    if(!vehicle) throw new HttpException(`No existe un vehículo con ID ${reservation.vehicleId}.`, HttpStatus.BAD_REQUEST);

    const place = await this.prisma.parking_Space.findUnique({
      where: {
        id: reservation.placeId
      }
    });
    if(!place) throw new HttpException(`No existe una plaza con ID ${reservation.placeId}.`, HttpStatus.BAD_REQUEST);

    const flag = await this.notExistsOverlap(reservation, 0);
    let reservation_result = null;

    if(flag){
      try {
        reservation_result = await this.prisma.reservations.create({ data: reservation });
      } catch (error) {
        throw new HttpException('Error inesperado al crear la reservación.', HttpStatus.INTERNAL_SERVER_ERROR);
      }
      
    }
    else{
      throw new HttpException('Hay otra reservación en ese período.', HttpStatus.BAD_REQUEST);
    }
    
    const init_dateTime = new Date(reservation.init_dateTime);
    const end_dateTime = new Date(reservation.end_dateTime);
    await this.logsService.createLog('Reservación', authenticated_user.userId, 
      `Se reservó la plaza ${reservation.placeId} desde la fecha ${init_dateTime.toUTCString()} hasta ${end_dateTime.toUTCString()}, para el vehículo de licencia: ${vehicle.license_vehicle} a nombre del cliente ${client.name}.`);

    return reservation_result;
  }

  async findAll() {
    return await this.prisma.reservations.findMany();
  }

  async findOne(id_reservation: number) {
    const reservation = await this.prisma.reservations.findUnique({
      where: {
        id: id_reservation,
      }
    });

    if (!reservation) {
      throw new HttpException(
        { status: HttpStatus.NOT_FOUND, description: `El registro con ID ${id_reservation} no existe.` },
        HttpStatus.NOT_FOUND,
      );
    }

    return reservation;
  }

  async update(id_reservation: number, updateReservationDto : UpdateReservationDto) {

    const reservation = await this.prisma.reservations.findUnique({
      where: {
        id: id_reservation
      }
    });
    const flag = await this.notExistsOverlap({...reservation, ...updateReservationDto}, id_reservation);
    
    if(flag){
      try {
        return await this.prisma.reservations.update({
          where: {
            id: id_reservation
          },
          data: updateReservationDto
        });
      } catch (error) {
        throw new HttpException('Error inesperado al actualizar la reservación. Verifique los datos de la reservación.', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
    else{
      throw new HttpException('Hay otra reservación en ese período.', HttpStatus.BAD_REQUEST);
    }
    
  }

  async remove(id_reservation: number, authenticated_user : AuthenticatedUserDto, is_cancellation : boolean) {

    let reservation = null;

    try {
      reservation = await this.prisma.reservations.delete({
        where: {
          id: id_reservation
        }
      });
    } catch (error) {
      throw new HttpException({ status: HttpStatus.NOT_FOUND, description: `El registro con ID ${id_reservation} no existe.` },
        HttpStatus.NOT_FOUND);
    }

    if(is_cancellation){
      const init_dateTime = new Date(reservation.init_dateTime);
      const end_dateTime = new Date(reservation.end_dateTime);
      const license_vehicle = await this.prisma.vehicle.findUnique({
        where: {
          id: reservation.vehicleId
        },
        select: {
          license_vehicle: true
        }
      });
      const clientName = await this.prisma.user.findUnique({
        where: {
          id: reservation.clientId
        },
        select: {
          name: true
        }
      });
      await this.logsService.createLog('Cancelación', authenticated_user.userId, 
        `Se canceló la reservación en la plaza ${reservation.placeId}, en la fecha desde ${init_dateTime.toUTCString()} hasta ${end_dateTime.toUTCString()}, para el vehículo de licencia: ${license_vehicle.license_vehicle} a nombre del cliente ${clientName.name}.`);
    }

    return reservation;
  }

  async notExistsOverlap(reservation : CreateReservationDto, param_id : number) {
    const place = await this.prisma.parking_Space.findUnique({
      where: {
        id: reservation.placeId
      }
    });
    let is_valid = true; //Indica que es válida la reservación, es decir, no hay otra reservación en el mismo período o en la misma plaza
    let is_found_emptyPlace = false; //Indica que se encontró una plaza libre
    if(!place) throw new HttpException(`No existe una plaza con ID ${place.id}.`, HttpStatus.BAD_REQUEST);
    else{
      if(place.clientId){ //Si la plaza está ocupada
        if((reservation.init_dateTime < place.init_dateTime && reservation.end_dateTime < place.init_dateTime) ||
            (reservation.init_dateTime > place.end_dateTime && reservation.end_dateTime > place.end_dateTime)){} //La fecha_hora no se superpone
        else{ //La fecha_hora se superpone
          is_valid = false;
        }
      }
      else{ // Si la plaza está libre
        is_found_emptyPlace = true;
      }
    }

    const all_reservations = await this.findAll();
    if(!is_found_emptyPlace && is_valid){
      is_found_emptyPlace = true;
      for (let i = 0; i < all_reservations.length; i++) {
        const element = all_reservations[i];
        if(element.id == param_id) continue; //Ignorar una reservación con el mismo ID que la que está en curso, pues siempre provocará una superposición
        if(element.placeId == reservation.placeId){
          if((reservation.init_dateTime < element.init_dateTime && reservation.end_dateTime < element.init_dateTime) ||
             (reservation.init_dateTime > element.end_dateTime && reservation.end_dateTime > element.end_dateTime)){ //La fecha_hora no se superpone
              continue;
          }else{ //La fecha_hora se superpone
            is_valid = false;
            is_found_emptyPlace = false;
            break;
          }
        }
        
      }
    }

    return is_found_emptyPlace && is_valid;
  }

}


