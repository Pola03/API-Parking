import { Module } from '@nestjs/common';
import { ParkingSpaceService } from './parking_space.service';
import { ParkingSpaceController } from './parking_space.controller';
import { PrismaService } from '../prisma.service';
import { LogsService } from '../logs/logs.service';
import { LogsModule } from '../logs/logs.module';

@Module({
  imports: [LogsModule],
  controllers: [ParkingSpaceController],
  providers: [ParkingSpaceService, PrismaService, LogsService],
})
export class ParkingSpaceModule {}
