import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs/index';

import {Node, Message} from '../../interfaces';


@Injectable({
  providedIn: 'root'
})
export class NodeService {

  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: HttpClient) {
  }

  // get

  getAll(params: any = {}): Observable<Node[]> {
    return this.http.get<Node[]>('/api2/nodes', {
      params: new HttpParams({
        fromObject: params
      })
    });
  }

  getNodeInGroup(gatewayId: number): Observable<Node[]> {
    return this.http.get<Node[]>(`/api2/gateways/${gatewayId}/nodes`);
  }

  // post

  ins(node: Node): Observable<Node> {
    return this.http.post<Node>('/api2/nodes', node);
  }

  setNodeInGatewayGr(gatewayId: number, nodeIds: number[]): Observable<any> {
    const options = JSON.stringify(nodeIds);
    return this.http.post<any>(`/api2/gateways/${gatewayId}/nodes`, options);
  }

  // patch

  upd(node: Node): Observable<Node> {
    return this.http.patch<Node>('/api2/nodes', node);
  }

  // delete

  delNodeInGatewayGr(gatewayId: number, nodeIds: number[]): Observable<any> {
    const options = {
      headers: new HttpHeaders({}),
      body: JSON.stringify(nodeIds)
    };
    return this.http.delete<any>(`/api2/gateways/${gatewayId}/nodes`, options);
  }

  del(id_node: number): Observable<Message> {
    return this.http.delete<Message>(`/api2/nodes/${id_node}`);
  }
}
