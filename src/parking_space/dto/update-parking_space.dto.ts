import { PartialType } from '@nestjs/mapped-types';
import { CreateParkingSpaceDto } from './create-parking_space.dto';

export class UpdateParkingSpaceDto extends PartialType(CreateParkingSpaceDto) {}
