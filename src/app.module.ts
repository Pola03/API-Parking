import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ParkingSpaceModule } from './parking_space/parking_space.module';
import { ReservationsModule } from './reservations/reservations.module';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { LogsModule } from './logs/logs.module';
import { VehicleModule } from './vehicle/vehicle.module';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [UserModule, ParkingSpaceModule, ReservationsModule, AuthModule, VehicleModule, LogsModule,
    MongooseModule.forRoot(process.env.MONGODB_URI),
    ConfigModule.forRoot()
    ],
  controllers: [AppController]
})
export class AppModule {}
