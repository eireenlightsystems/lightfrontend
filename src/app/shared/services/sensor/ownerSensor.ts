import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/index';

import {Owner} from '../../interfaces';

@Injectable({
  providedIn: 'root'
})
export class OwnerSensorService {
  constructor(private http: HttpClient) {
  }

  fetch(): Observable<Owner[]> {
    return this.http.get<Owner[]>('/api/v1/sensors-owners');
  }

}
