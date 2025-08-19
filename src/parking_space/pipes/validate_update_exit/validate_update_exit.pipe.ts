import { ArgumentMetadata, HttpException, HttpStatus, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ValidateUpdateExitPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    const id = parseInt(value.id.toString(), 10);
    if(isNaN(id)) throw new HttpException(`El ID ${id} recibido no es un número.`, HttpStatus.BAD_REQUEST);
    
    try {
      const date_exit = new Date(value.date_exit.toString());
      return {id, date_exit};
    } catch (error) {
      throw new HttpException(`El valor ${value.date_exit.toString()} no es una fecha.`, HttpStatus.BAD_REQUEST);
    }

  }
}
