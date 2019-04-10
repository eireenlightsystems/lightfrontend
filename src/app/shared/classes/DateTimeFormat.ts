import {formatDate} from '@angular/common';

export class DateTimeFormat {

  fromDataPickerString(str: string) {
    return this.toIso8601TZString(new Date(str));
  }

  // new Date(new Date().setHours(0, 0, 0, 0))
  toIso8601TZString(date: Date) {
    return formatDate(date, 'yyyy-MM-ddTHH:mm:ss ZZZZZ', 'en', 'ZZZZZ');
  }

  toDataPickerString(date: Date) {
    return formatDate(date, 'yyyy-MM-dd HH:mm', 'en', 'ZZZZZ');
  }
}
