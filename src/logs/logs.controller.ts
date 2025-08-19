import { Controller, Get, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { LogsService } from './logs.service';
import { Roles } from '../roles/roles.decorator';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt/jwt_auth.guard';
import { RolesGuard } from '../roles/roles.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('logs')
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  @Get()
  async getLogs() {
    const logs = await this.logsService.getLogs();
    if (!logs.length) {
      throw new HttpException('No hay registros de actividad disponibles', HttpStatus.NOT_FOUND);
    }
    return logs;
  }
}
