import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from '../prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtConstants } from './jwt/jwt.constants';
import { JwtStrategy } from './jwt/jwt.strategy';
import { RolesGuard } from '../roles/roles.guard';

@Module({
  imports: [JwtModule.register({
              secret: JwtConstants.secret,
              signOptions: {expiresIn: '20h'}
            })],
  controllers: [AuthController],
  providers: [AuthService, PrismaService, JwtStrategy, RolesGuard],
})
export class AuthModule {}
