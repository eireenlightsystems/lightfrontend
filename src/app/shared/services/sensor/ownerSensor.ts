import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/index';

import {OwnerSensor} from '../../interfaces';

@Injectable({
  providedIn: 'root'
})
export class OwnerSensorService {
  constructor(private http: HttpClient) {
  }

  fetch(): Observable<OwnerSensor[]> {
    return this.http.get<OwnerSensor[]>('/api2/sensors-owners');
  }

}
