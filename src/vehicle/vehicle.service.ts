import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { PrismaService } from '../prisma.service';
import { Role } from '@prisma/client';
import { AuthenticatedUserDto } from '../user/dto/autheticated-user.dto';

@Injectable()
export class VehicleService {

  constructor(private prisma : PrismaService){}

  async create(createVehicleDto: CreateVehicleDto) {

    const client = await this.prisma.user.findUnique({
      where: {
        id: createVehicleDto.clientId,
        role: Role.CLIENT
      },
      select: {
        name: true
      }
    });
    if(!client) throw new HttpException(`No existe un cliente con ID ${createVehicleDto.clientId}.`, HttpStatus.BAD_REQUEST);

    const existingVehicle = await this.prisma.vehicle.findFirst({
      where: {
        clientId: createVehicleDto.clientId,
        license_vehicle: createVehicleDto.license_vehicle,
      },
    });

    if (existingVehicle) {
      throw new HttpException(
        `Ya existe un vehículo con la licencia ${createVehicleDto.license_vehicle} para el cliente con ID ${createVehicleDto.clientId}.`,
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      return await this.prisma.vehicle.create({ data: createVehicleDto });
    } catch (error) {
      throw new HttpException('Error inesperado al crear el vehículo.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAll() {
    return await this.prisma.vehicle.findMany();
  }

  async findAllClientVehicle(id_client : number) {
    const vehicles = await this.prisma.vehicle.findMany({
      where: {
        clientId: id_client
      }
    });

    if(vehicles.length == 0) throw new HttpException(`No existe un cliente con el ID ${id_client}.`, HttpStatus.NOT_FOUND);

    return vehicles;
  }

  async findOne(id_vehicle: number) {
    const vehicle = await this.prisma.vehicle.findUnique({
      where: {
        id: id_vehicle,
      },
      select: {
        license_vehicle: true,
        model_vehicle: true,
        color_vehicle: true,
        client: {
          select: {
            name: true
          }
        }
      }
    });

    if (!vehicle) {
      throw new HttpException(`El registro con ID ${id_vehicle} no existe.`, HttpStatus.NOT_FOUND);
    }

    return vehicle;
  }

  async update(id_vehicle: number, updateVehicleDto: UpdateVehicleDto, authenticated_user : AuthenticatedUserDto) {

    const vehicle = await this.findOne(id_vehicle);
    if(authenticated_user.role == Role.CLIENT){
      try {
        return await this.prisma.vehicle.update({
          where: {
            id: id_vehicle,
            clientId: authenticated_user.userId
          },
          data: updateVehicleDto
        });
      } catch (error) {
        throw new HttpException(`El cliente con ID ${authenticated_user.userId} no posee el vehículo de licencia ${updateVehicleDto.license_vehicle}.`,
          HttpStatus.BAD_REQUEST
        );
      }
    }

    try {
      return await this.prisma.vehicle.update({
        where: {
          id: id_vehicle
        },
        data: updateVehicleDto
      });
    } catch (error) {
      throw new HttpException(`Error inesperado al actualizar los datos del vehículo. Verifique sus datos.`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

  }

  async remove(id_vehicle: number) {
    try {
      return await this.prisma.vehicle.delete({
        where: {
          id: id_vehicle
        }
      });
    } catch (error) {
      throw new HttpException(`El registro con ID ${id_vehicle} no existe.`, HttpStatus.NOT_FOUND);
    }
  }
}
