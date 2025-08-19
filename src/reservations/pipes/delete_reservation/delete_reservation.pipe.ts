import { ArgumentMetadata, HttpException, HttpStatus, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class DeleteReservationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    const id = parseInt(value.id.toString(), 10);
    if(isNaN(id)) throw new HttpException(`El ID ${id} recibido no es un número.`, HttpStatus.BAD_REQUEST);

    let is_cancellation = null;
    if(value.is_cancellation.toString() == 'true') is_cancellation = true;
    else if(value.is_cancellation.toString() == 'false') is_cancellation = false;
    else{
      throw new HttpException(`El valor ${is_cancellation} no es un valor booleano.`, HttpStatus.BAD_REQUEST);
    }

    return {id, is_cancellation};
  }
}
