import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs/index';

import {Message, User} from '../../interfaces';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: HttpClient) {
  }

  // get

  getAll(params: any = {}): Observable<User[]> {
    return this.http.get<User[]>('/api/v1/users', {
      params: new HttpParams({
        fromObject: params
      })
    });
  }

  // post

  ins(user: User): Observable<User> {
    return this.http.post<User>('/api/v1/users', user);
  }

  // patch

  upd(user: User): Observable<User> {
    return this.http.patch<User>('/api/v1/users', user);
  }

  // delete

  del(userID: number): Observable<Message> {
    return this.http.delete<Message>(`/api/v1/users/${userID}`);
  }

}
