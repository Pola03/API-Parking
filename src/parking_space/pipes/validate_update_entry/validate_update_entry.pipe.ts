import { ArgumentMetadata, HttpException, HttpStatus, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ValidateUpdateEntryPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {

    const id = parseInt(value.id.toString(), 10);
    if(isNaN(id)) throw new HttpException(`El ID ${id} recibido no es un número.`, HttpStatus.BAD_REQUEST);

    let is_entry = null;
    if(value.is_entry.toString() == 'true') is_entry = true;
    else if(value.is_entry.toString() == 'false') is_entry = false;
    else{
      throw new HttpException(`El valor ${is_entry} no es un valor booleano.`, HttpStatus.BAD_REQUEST);
    }

    return {id, is_entry};
  }
}
