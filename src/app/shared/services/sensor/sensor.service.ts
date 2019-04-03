import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs/index';

import {Message, NodeSensor, Sensor} from '../../interfaces';

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

  ins(sensor: Sensor): Observable<Sensor> {
    return this.http.post<Sensor>('/api2/sensors', sensor);
  }

  upd(sensor: Sensor): Observable<Sensor> {
    return this.http.patch<Sensor>('/api2/sensors', sensor);
  }

  del(id_sensor: number): Observable<Message> {
    return this.http.delete<Message>(`/api2/sensors/${id_sensor}`);
  }

  // set_id_node(nodeSensor: NodeSensor): Observable<NodeSensor> {
  //   return this.http.patch<NodeSensor>('/api/sensor/set_id_node', nodeSensor);
  // }

}
