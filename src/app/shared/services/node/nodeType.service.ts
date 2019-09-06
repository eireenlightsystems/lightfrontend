import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs/index';

import {NodeType, Message} from '../../interfaces';

@Injectable({
  providedIn: 'root'
})
export class NodeTypeService {
  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: HttpClient) {
  }

  // get

  getAll(params: any = {}): Observable<NodeType[]> {
    return this.http.get<NodeType[]>('/api/v1/nodes-types', {
      params: new HttpParams({
        fromObject: params
      })
    });
  }

  // post

  ins(nodeType: NodeType): Observable<NodeType> {
    return this.http.post<NodeType>('/api/v1/nodes-types', nodeType);
  }

  // patch

  upd(nodeType: NodeType): Observable<NodeType> {
    return this.http.patch<NodeType>('/api/v1/nodes-types', nodeType);
  }

  // delete

  del(id_nodeType: number): Observable<Message> {
    return this.http.delete<Message>(`/api/v1/nodes-types/${id_nodeType}`);
  }

}
