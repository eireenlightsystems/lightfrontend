import {Injectable} from '@angular/core'
import {HttpClient, HttpParams} from '@angular/common/http'
import {Fixture, Gateway, Message} from '../../interfaces'
import {Observable} from 'rxjs/index'

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

  ins(gateway: Gateway): Observable<Gateway> {
    return this.http.post<Gateway>('/api/gateway', gateway)
  }

  upd(gateway: Gateway): Observable<Gateway> {
    return this.http.patch<Gateway>('/api/gateway', gateway)
  }

  set_id_node(gateway: Gateway): Observable<Gateway> {
    return this.http.patch<Gateway>('/api/gateway/set_id_node', gateway)
  }

  del(id_gateway: number): Observable<Message> {
    return this.http.delete<Message>(`/api/gateway/${id_gateway}`)
  }
}
