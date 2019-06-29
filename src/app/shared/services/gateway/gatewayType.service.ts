import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs/index';

import {EquipmentType, GatewayType, Message} from '../../interfaces';

@Injectable({
  providedIn: 'root'
})
export class GatewayTypeService {
  constructor(private http: HttpClient) {
  }

  // fetch(): Observable<EquipmentType[]> {
  //   return this.http.get<EquipmentType[]>('/api/v1/gateways-types');
  // }

  // get

  getAll(params: any = {}): Observable<GatewayType[]> {
    return this.http.get<GatewayType[]>('/api/v1/gateways-types', {
      params: new HttpParams({
        fromObject: params
      })
    });
  }

  // post

  ins(gatewayType: GatewayType): Observable<GatewayType> {
    return this.http.post<GatewayType>('/api/v1/gateways-types', gatewayType);
  }

  // patch

  upd(gatewayType: GatewayType): Observable<GatewayType> {
    return this.http.patch<GatewayType>('/api/v1/gateways-types', gatewayType);
  }

  // delete

  del(id_gatewayType: number): Observable<Message> {
    return this.http.delete<Message>(`/api/v1/gateways-types/${id_gatewayType}`);
  }

}
