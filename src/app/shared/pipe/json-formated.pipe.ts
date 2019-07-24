// @ts-ignore
import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'jsonFormated'
})
export class JsonFormatedPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    let str = '';
    if (value) {
      str = JSON.stringify(value, undefined, 4)
        .replace(/ /g, '&nbsp;')
        .replace(/\n/g, '<br/>');
    }
    return str;
  }

}
