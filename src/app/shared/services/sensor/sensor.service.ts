import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs/index';

import {Gateway, Message, NodeSensor, Sensor} from '../../interfaces';

@Injectable({
  providedIn: 'root'
})
export class SensorService {

  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: HttpClient) {
  }

  getAll(params: any = {}): Observable<Sensor[]> {
    return this.http.get<Sensor[]>('/api2/sensors', {
      params: new HttpParams({
        fromObject: params
      })
    });
  }

  getSensorNotInGroup(): Observable<Gateway[]> {
    return this.http.get<Gateway[]>('/api2/nodes/1/sensors');
  }

  ins(sensor: Sensor): Observable<Sensor> {
    return this.http.post<Sensor>('/api2/sensors', sensor);
  }

  upd(sensor: Sensor): Observable<Sensor> {
    return this.http.patch<Sensor>('/api2/sensors', sensor);
  }

  del(id_sensor: number): Observable<Message> {
    return this.http.delete<Message>(`/api2/sensors/${id_sensor}`);
  }

  setNodeId(nodeId: number, sensorIds: number[]): Observable<any> {
    const options = JSON.stringify(sensorIds);
    return this.http.post<any>(`/api2/nodes/${nodeId}/sensors`, options);
  }

  delNodeId(nodeId: number, sensorIds: number[]): Observable<any> {
    const options = {
      headers: new HttpHeaders({}),
      body: JSON.stringify(sensorIds)
    };
    return this.http.delete<any>(`/api2/nodes/${nodeId}/sensors`, options);
  }

}
