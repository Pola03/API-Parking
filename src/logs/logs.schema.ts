import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LogDocument = Log & Document;

@Schema({ timestamps: true })
export class Log {
  @Prop({ required: true })
  action: string; // Acción como "reserva", "cancelación", "entrada", "salida"

  @Prop({ required: true })
  userId: number; // ID del usuario que realizó la acción

  @Prop({ required: true })
  details: string; // Detalles adicionales del evento
}

export const LogSchema = SchemaFactory.createForClass(Log);
