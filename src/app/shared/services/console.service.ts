import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConsoleService {

  constructor() {
  }

  log(str: string) {
    console.log(str);
  }
}
