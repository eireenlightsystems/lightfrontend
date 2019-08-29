import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs/index';

import {Message, Components} from '../../interfaces';


@Injectable({
  providedIn: 'root'
})
export class ComponentService {

  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: HttpClient) {
  }

  // get

  getAll(params: any = {}): Observable<Components[]> {
    return this.http.get<Components[]>('/api/v1/components', {
      params: new HttpParams({
        fromObject: params
      })
    });
  }

  // post

  ins(component: Components): Observable<Components> {
    return this.http.post<Components>('/api/v1/components', component);
  }

  // patch

  upd(component: Components): Observable<Components> {
    return this.http.patch<Components>('/api/v1/components', component);
  }

  // delete

  del(componentID: number): Observable<Message> {
    return this.http.delete<Message>(`/api/v1/components/${componentID}`);
  }
}
