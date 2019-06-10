import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs/index';

import {EquipmentType, Message, NodeType, SensorType} from '../../interfaces';

@Injectable({
  providedIn: 'root'
})
export class SensorTypeService {
  constructor(private http: HttpClient) {
  }

  // fetch(): Observable<EquipmentType[]> {
  //   return this.http.get<EquipmentType[]>('/api/v1/sensors-types');
  // }

  // get

  getAll(params: any = {}): Observable<SensorType[]> {
    return this.http.get<SensorType[]>('/api/v1/sensors-types', {
      params: new HttpParams({
        fromObject: params
      })
    });
  }

  // post

  ins(sensorType: SensorType): Observable<SensorType> {
    // return this.http.post<EquipmentType>('/api/v1/nodes', nodeType);
    return null;
  }

  // patch

  upd(sensorType: SensorType): Observable<SensorType> {
    // return this.http.patch<EquipmentType>('/api/v1/nodes', nodeType);
    return null;
  }

  // delete

  del(id_sensorType: number): Observable<Message> {
    // return this.http.delete<Message>(`/api/v1/nodes/${id_nodeType}`);
    return null;
  }
}
