import { Pipe, PipeTransform } from '@angular/core';
import { IngresoEgreso } from '../models/ingreso-egreso.models';

@Pipe({
  name: 'ordenIE'
})
export class OrdenIEPipe implements PipeTransform {

  transform(items: IngresoEgreso[]): IngresoEgreso[] {
    return items.slice().sort( (a, b) => {
      if ( a.tipo === 'ingreso' ) {
        return -1;
      } else {
        return 1;
      }
    });
  }

}
