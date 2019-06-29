import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs/index';

import {Contract, Message} from '../../interfaces';

@Injectable({
  providedIn: 'root'
})
export class NodeTypeService {
  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: HttpClient) {
  }

  // get

  getAll(params: any = {}): Observable<Contract[]> {
    return this.http.get<Contract[]>('/api/v1/nodes-types', {
      params: new HttpParams({
        fromObject: params
      })
    });
  }

  // post

  ins(nodeType: Contract): Observable<Contract> {
    return this.http.post<Contract>('/api/v1/nodes-types', nodeType);
  }

  // patch

  upd(nodeType: Contract): Observable<Contract> {
    return this.http.patch<Contract>('/api/v1/nodes-types', nodeType);
  }

  // delete

  del(id_nodeType: number): Observable<Message> {
    return this.http.delete<Message>(`/api/v1/nodes-types/${id_nodeType}`);
  }

}
