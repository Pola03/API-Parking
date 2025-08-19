import { Module } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { PrismaService } from '../prisma.service';
import { LogsService } from '../logs/logs.service';
import { LogsModule } from '../logs/logs.module';

@Module({
  imports: [LogsModule],
  controllers: [ReservationsController],
  providers: [ReservationsService, PrismaService, LogsService],
})
export class ReservationsModule {}
