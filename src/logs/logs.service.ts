import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Log, LogDocument } from './logs.schema';
import { Model } from 'mongoose';

@Injectable()
export class LogsService {

  constructor(@InjectModel(Log.name) private logModel: Model<LogDocument>) {}

  async createLog(action: string, userId: number, details: string): Promise<Log> {
    const newLog = new this.logModel({ action, userId, details });
    return newLog.save();
  }

  async getLogs(): Promise<Log[]> {
    return this.logModel.find().exec();
  }

}
