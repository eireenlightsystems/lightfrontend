import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {OwnerSensor} from '../../interfaces';
import {Observable} from 'rxjs/index';

@Injectable({
  providedIn: 'root'
})
export class OwnerSensorService {
  constructor(private http: HttpClient) {
  }

  fetch(): Observable<OwnerSensor[]> {
    return this.http.get<OwnerSensor[]>('/api/owner-sensor');
  }

}
