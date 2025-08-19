import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UpdateParkingSpaceDto } from './dto/update-parking_space.dto';
import { PrismaService } from '../prisma.service';
import { LogsService } from '../logs/logs.service';
import { AuthenticatedUserDto } from '../user/dto/autheticated-user.dto';
import { Role } from '@prisma/client';

@Injectable()
export class ParkingSpaceService {

  constructor( private prisma:PrismaService,
               private logsService : LogsService
  ){}
  
  async create(amount : number) {
    for (let i = 0; i < amount; i++) {
      await this.prisma.parking_Space.create({data: {init_dateTime: null, end_dateTime: null, clientId: null, vehicleId: null}});
    }

    return 'Las plazas fueron creadas satisfactoriamente.'
  }

  async findAll() {
    const all_places = await this.prisma.parking_Space.findMany();
    let occupied_places = [];
    let amount_empty_places = 0;
    
    for (let i = 0; i < all_places.length; i++) {
      if(all_places[i].clientId){
        occupied_places.push(all_places[i]);
      }
      else{
        amount_empty_places++;
      }
    }

    return {amount_empty_places, occupied_places};
  }

  async findOne(id_parking: number) {
    const parkingSpace = await this.prisma.parking_Space.findUnique({
      where: {
        id: id_parking,
      }
    });

    if (!parkingSpace) {
      throw new HttpException(
        { status: HttpStatus.NOT_FOUND, description: `El registro con ID ${id_parking} no existe.` },
        HttpStatus.NOT_FOUND,
      );
    }

    return parkingSpace;
  }

  async updateEntry(id_parking: number, updateParkingSpaceDto: UpdateParkingSpaceDto, is_entry : boolean, 
    authenticated_user : AuthenticatedUserDto) {

    // Verificaciones
    const place = await this.prisma.parking_Space.findUnique({
      where: {
        id: id_parking
      },
      select: {
        clientId: true
      }
    });
    if(place && place.clientId) throw new HttpException(`La plaza ${id_parking} está ocupada en este momento.`, HttpStatus.BAD_REQUEST);

    if(updateParkingSpaceDto.end_dateTime < updateParkingSpaceDto.init_dateTime){
      throw new HttpException('La fecha final no puede ser menor que la fecha inicial.', HttpStatus.BAD_REQUEST);
    }

    if(!updateParkingSpaceDto.clientId){
      throw new HttpException('Debe ingresar un cliente.', HttpStatus.BAD_REQUEST);
    }
    const client = await this.prisma.user.findUnique({
      where: {
        id: updateParkingSpaceDto.clientId,
        role: Role.CLIENT
      },
      select: {
        name: true
      }
    });
    if(!client) throw new HttpException(`No existe un cliente con ID ${updateParkingSpaceDto.clientId}.`, HttpStatus.BAD_REQUEST);

    if(!updateParkingSpaceDto.vehicleId){
      throw new HttpException('Debe ingresar un vehículo.', HttpStatus.BAD_REQUEST);
    }
    const vehicle = await this.prisma.vehicle.findUnique({
      where: {
        id: updateParkingSpaceDto.vehicleId
      },
      select: {
        license_vehicle: true
      }
    });
    if(!vehicle) throw new HttpException(`No existe un vehículo con ID ${updateParkingSpaceDto.vehicleId}.`, HttpStatus.BAD_REQUEST);

    // Actualizar la plaza
    try {
      const parking_space = await this.prisma.parking_Space.update({
        where: {
          id: id_parking
        },
        data: updateParkingSpaceDto
      });

      // Si es una entrada, añadirla al historial de actividades
      if(is_entry){
        const init_dateTime = new Date(parking_space.init_dateTime);
        const end_dateTime = new Date(parking_space.end_dateTime);
        
        try {
          const log = await this.logsService.createLog('Entrada', authenticated_user.userId, 
            `Se produjo la entrada del vehículo de licencia: ${vehicle.license_vehicle} a nombre del cliente ${client.name} en la fecha ${init_dateTime.toUTCString()}, para recoger en la fecha ${end_dateTime.toUTCString()}. Fue ocupada la plaza con ID ${parking_space.id}.`);
        } catch (error) {
          console.log('error', error);
        }
      }

      return parking_space;

    } catch (error) {
      throw new HttpException(`El registro con ID ${id_parking} no existe.`, HttpStatus.NOT_FOUND);
    }
  }

  async updateExit(id_parking: number, authenticated_user : AuthenticatedUserDto, date_exit : Date) {

    // Verificaciones
    const place = await this.prisma.parking_Space.findUnique({
      where: {
        id: id_parking
      },
      select: {
        clientId: true,
        vehicle: {
          select: {
            license_vehicle: true
          }
        },
        client: {
          select: {
            name: true
          }
        }
      }
    });
    if(place && !place.clientId) throw new HttpException(`La plaza ${id_parking} está libre.`, HttpStatus.BAD_REQUEST);

    // Vaciar la plaza
    try {
      const parking_space = await this.prisma.parking_Space.update({
        where: {
          id: id_parking
        },
        data: {
          init_dateTime: null,
          end_dateTime: null,
          clientId: null,
          vehicleId: null
        }
      });

      // Agregar al historial de actividades
      await this.logsService.createLog('Salida', authenticated_user.userId, 
        `Se produjo la salida del vehículo de licencia: ${place.vehicle.license_vehicle} a nombre del cliente ${place.client.name} en la fecha ${date_exit.toUTCString()}. Fue desocupada la plaza con ID ${parking_space.id}.`);

      return parking_space;
    } catch (error) {
      throw new HttpException(`El registro con ID ${id_parking} no existe.`, HttpStatus.NOT_FOUND);
    }
  }

  async remove(id_parking: number) {
    try {
      return await this.prisma.parking_Space.delete({
        where: {
          id: id_parking
        }
      });
    } catch (error) {
      throw new HttpException(`El registro con ID ${id_parking} no existe.`, HttpStatus.NOT_FOUND);
    }
  }
  
}
