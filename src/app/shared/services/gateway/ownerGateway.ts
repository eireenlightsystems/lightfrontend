import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/index';

import {Owner} from '../../interfaces';

@Injectable({
  providedIn: 'root'
})
export class OwnerGatewayService {
  constructor(private http: HttpClient) {
  }

  fetch(): Observable<Owner[]> {
    return this.http.get<Owner[]>('/api2/gateways-owners');
  }

}
