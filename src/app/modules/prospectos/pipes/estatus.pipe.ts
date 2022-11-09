import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'estatus',
})
export class EstatusPipe implements PipeTransform {
  public transform(value: any, args?: any): any {
    let desc = '';
    switch (value) {
      case 1:
        desc = 'ENVIADO';
        break;
      case 2:
        desc = 'AUTORIZADO';
        break;
      case 3:
        desc = 'RECHAZADO';
        break;
    }
    return desc;
  }
}
