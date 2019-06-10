import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs/index';

import {Gateway, Message} from '../../interfaces';

@Injectable({
  providedIn: 'root'
})
export class GatewayService {

  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: HttpClient) {
  }

  getAll(params: any = {}): Observable<Gateway[]> {
    return this.http.get<Gateway[]>('/api/v1/gateways', {
      params: new HttpParams({
        fromObject: params
      })
    });
  }

  getAllWithoutParam(): Observable<Gateway[]> {
    return this.http.get<Gateway[]>('/api/v1/gateways');
  }

  getGatewayNotInGroup(): Observable<Gateway[]> {
    return this.http.get<Gateway[]>('/api/v1/nodes/1/gateways');
  }

  ins(gateway: Gateway): Observable<Gateway> {
    return this.http.post<Gateway>('/api/v1/gateways', gateway);
  }

  del(id_gateway: number): Observable<Message> {
    return this.http.delete<Message>(`/api/v1/gateways/${id_gateway}`);
  }

  upd(gateway: Gateway): Observable<Gateway> {
    return this.http.patch<Gateway>('/api/v1/gateways', gateway);
  }

  setNodeId(nodeId: number, gatewayIds: number[]): Observable<any> {
    const options = JSON.stringify(gatewayIds);
    return this.http.post<any>(`/api/v1/nodes/${nodeId}/gateways`, options);
  }

  delNodeId(nodeId: number, gatewayIds: number[]): Observable<any> {
    const options = {
      headers: new HttpHeaders({}),
      body: JSON.stringify(gatewayIds)
    };
    return this.http.delete<any>(`/api/v1/nodes/${nodeId}/gateways`, options);
  }
}
