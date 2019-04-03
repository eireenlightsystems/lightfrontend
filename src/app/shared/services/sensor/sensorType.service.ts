import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/index';

import {SensorType} from '../../interfaces';

@Injectable({
  providedIn: 'root'
})
export class SensorTypeService {
  constructor(private http: HttpClient) {
  }

  fetch(): Observable<SensorType[]> {
    return this.http.get<SensorType[]>('/api2/sensors-types');
  }

}
