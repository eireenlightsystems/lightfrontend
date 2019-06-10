import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs/index';

import {EquipmentType, Gateway, Message, NodeSensor, Sensor} from '../../interfaces';

@Injectable({
  providedIn: 'root'
})
export class SensorService {

  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: HttpClient) {
  }

  // get
  getAll(params: any = {}): Observable<Sensor[]> {
    return this.http.get<Sensor[]>('/api/v1/sensors', {
      params: new HttpParams({
        fromObject: params
      })
    });
  }

  getSensorNotInGroup(): Observable<Gateway[]> {
    return this.http.get<Gateway[]>('/api/v1/nodes/1/sensors');
  }

  getSensorTypes(): Observable<EquipmentType[]> {
    return this.http.get<EquipmentType[]>('/api/v1/sensors-types');
  }

  // post
  ins(sensor: Sensor): Observable<Sensor> {
    return this.http.post<Sensor>('/api/v1/sensors', sensor);
  }

  setNodeId(nodeId: number, sensorIds: number[]): Observable<any> {
    const options = JSON.stringify(sensorIds);
    return this.http.post<any>(`/api/v1/nodes/${nodeId}/sensors`, options);
  }

  // patch
  upd(sensor: Sensor): Observable<Sensor> {
    return this.http.patch<Sensor>('/api/v1/sensors', sensor);
  }

  // delete
  del(id_sensor: number): Observable<Message> {
    return this.http.delete<Message>(`/api/v1/sensors/${id_sensor}`);
  }

  delNodeId(nodeId: number, sensorIds: number[]): Observable<any> {
    const options = {
      headers: new HttpHeaders({}),
      body: JSON.stringify(sensorIds)
    };
    return this.http.delete<any>(`/api/v1/nodes/${nodeId}/sensors`, options);
  }
}
