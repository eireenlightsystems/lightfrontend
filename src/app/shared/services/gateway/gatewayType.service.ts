import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/index';

import {GatewayType} from '../../interfaces';

@Injectable({
  providedIn: 'root'
})
export class GatewayTypeService {
  constructor(private http: HttpClient) {
  }

  fetch(): Observable<GatewayType[]> {
    return this.http.get<GatewayType[]>('/api2/gateways-types');
  }

}
