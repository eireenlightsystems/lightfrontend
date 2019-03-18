import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {SensorType} from '../../interfaces';
import {Observable} from 'rxjs/index';

@Injectable({
  providedIn: 'root'
})
export class SensorTypeService {
  constructor(private http: HttpClient) {
  }

  fetch(): Observable<SensorType[]> {
    return this.http.get<SensorType[]>('/api/sensor-type');
  }

}
