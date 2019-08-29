import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs/index';

import {Message, Role} from '../../interfaces';


@Injectable({
  providedIn: 'root'
})
export class RoleService {

  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: HttpClient) {
  }

  // get

  getAll(params: any = {}): Observable<Role[]> {
    return this.http.get<Role[]>('/api/v1/roles', {
      params: new HttpParams({
        fromObject: params
      })
    });
  }

  // post

  ins(role: Role): Observable<Role> {
    return this.http.post<Role>('/api/v1/roles', role);
  }

  setUserInRole(roleId: number, userIds: number[]): Observable<any> {
    const options = JSON.stringify(userIds);
    return this.http.post<any>(`/api/v1/roles/${roleId}/users`, options);
  }

  // patch

  upd(role: Role): Observable<Role> {
    return this.http.patch<Role>('/api/v1/roles', role);
  }

  // delete

  del(roleID: number): Observable<Message> {
    return this.http.delete<Message>(`/api/v1/roles/${roleID}`);
  }

  delUserInRole(roleId: number, userIds: number[]): Observable<any> {
    const options = {
      headers: new HttpHeaders({}),
      body: JSON.stringify(userIds)
    };
    return this.http.delete<any>(`/api/v1/roles/${roleId}/users`, options);
  }
}
