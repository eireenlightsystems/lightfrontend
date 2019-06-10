import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/index';

import {EquipmentType} from '../../interfaces';

@Injectable({
  providedIn: 'root'
})
export class GatewayTypeService {
  constructor(private http: HttpClient) {
  }

  fetch(): Observable<EquipmentType[]> {
    return this.http.get<EquipmentType[]>('/api/v1/gateways-types');
  }

}
