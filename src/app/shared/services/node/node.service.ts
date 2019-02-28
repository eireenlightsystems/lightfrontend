import {Injectable} from '@angular/core'
import {HttpClient, HttpParams} from '@angular/common/http'
import {Node, Message} from '../../interfaces'
import {Observable} from 'rxjs/index'

@Injectable({
  providedIn: 'root'
})
export class NodeService {

  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: HttpClient) {
  }

  getAll(params: any = {}): Observable<Node[]> {
    return this.http.get<Node[]>('/api/node', {
      params: new HttpParams({
        fromObject: params
      })
    })
  }

  ins(node: Node): Observable<Node> {
    return this.http.post<Node>('/api/node', node)
  }

  upd(node: Node): Observable<Node> {
    return this.http.patch<Node>('/api/node', node)
  }

  set_coords(node: Node): Observable<Node> {
    return this.http.patch<Node>('/api/node/set_coords', node)
  }

  del(id_node: number): Observable<Message> {
    return this.http.delete<Message>(`/api/node/${id_node}`)
  }
}
