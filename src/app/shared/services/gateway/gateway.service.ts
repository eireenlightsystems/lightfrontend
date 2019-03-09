import {Injectable} from '@angular/core'
import {HttpClient, HttpParams} from '@angular/common/http'
import {Observable} from 'rxjs/index'

import {Gateway, GatewayGroup, Message, NodeGateway, NodeInGroup} from '../../interfaces'

@Injectable({
  providedIn: 'root'
})
export class GatewayService {

  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: HttpClient) {
  }

  getAll(params: any = {}): Observable<Gateway[]> {
    return this.http.get<Gateway[]>('/api/gateway', {
      params: new HttpParams({
        fromObject: params
      })
    })
  }

  getGatewayGroups(id_gateway: number): Observable<GatewayGroup[]> {
    return this.http.get<GatewayGroup[]>(`/api/gateway/gatewayGr/${id_gateway}`)
  }

  getNodesInGroup(id_gateway: number): Observable<NodeInGroup[]> {
    return this.http.get<NodeInGroup[]>(`/api/gateway/get_node_in_group/${id_gateway}`)
  }

  ins(gateway: Gateway): Observable<Gateway> {
    return this.http.post<Gateway>('/api/gateway', gateway)
  }

  upd(gateway: Gateway): Observable<Gateway> {
    return this.http.patch<Gateway>('/api/gateway', gateway)
  }

  set_id_node(nodeGateway: NodeGateway): Observable<NodeGateway> {
    return this.http.patch<NodeGateway>('/api/gateway/set_id_node', nodeGateway)
  }

  del(id_gateway: number): Observable<Message> {
    return this.http.delete<Message>(`/api/gateway/${id_gateway}`)
  }

}
