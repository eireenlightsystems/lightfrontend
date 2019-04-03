import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/index';

import {OwnerGateway} from '../../interfaces';

@Injectable({
  providedIn: 'root'
})
export class OwnerGatewayService {
  constructor(private http: HttpClient) {
  }

  fetch(): Observable<OwnerGateway[]> {
    return this.http.get<OwnerGateway[]>('/api2/gateways-owners');
  }

}
