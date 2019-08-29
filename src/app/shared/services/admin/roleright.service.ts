import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs/index';

import {Message, Roleright} from '../../interfaces';


@Injectable({
  providedIn: 'root'
})
export class RolerightService {

  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: HttpClient) {
  }

  // get

  getAll(params: any = {}): Observable<Roleright[]> {
    return this.http.get<Roleright[]>('/api/v1/rolerights', {
      params: new HttpParams({
        fromObject: params
      })
    });
  }

  // post

  ins(roleright: Roleright): Observable<Roleright> {
    return this.http.post<Roleright>('/api/v1/rolerights', roleright);
  }

  // patch


  // delete

  del(rolerightID: number): Observable<Message> {
    return this.http.delete<Message>(`/api/v1/rolerights/${rolerightID}`);
  }
}
