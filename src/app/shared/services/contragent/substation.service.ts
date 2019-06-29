import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs/index';

import {Message, Substation} from '../../interfaces';

@Injectable({
  providedIn: 'root'
})
export class SubstationService {
  constructor(private http: HttpClient) {
  }

  // get

  getAll(params: any = {}): Observable<Substation[]> {
    return this.http.get<Substation[]>('/api/v1/substations', {
      params: new HttpParams({
        fromObject: params
      })
    });
  }

  // post

  ins(substation: Substation): Observable<Substation> {
    return this.http.post<Substation>('/api/v1/substations', substation);
  }

  // patch

  upd(substation: Substation): Observable<Substation> {
    return this.http.patch<Substation>('/api/v1/substations', substation);
  }

  // delete

  del(substationId: number): Observable<Message> {
    return this.http.delete<Message>(`/api/v1/substations/${substationId}`);
  }

}
