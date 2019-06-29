import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs/index';

import {Message, Person} from '../../interfaces';

@Injectable({
  providedIn: 'root'
})
export class PersonService {
  constructor(private http: HttpClient) {
  }

  // get

  getAll(params: any = {}): Observable<Person[]> {
    return this.http.get<Person[]>('/api/v1/persons', {
      params: new HttpParams({
        fromObject: params
      })
    });
  }

  // post

  ins(person: Person): Observable<Person> {
    return this.http.post<Person>('/api/v1/persons', person);
  }

  // patch

  upd(person: Person): Observable<Person> {
    return this.http.patch<Person>('/api/v1/persons', person);
  }

  // delete

  del(personId: number): Observable<Message> {
    return this.http.delete<Message>(`/api/v1/persons/${personId}`);
  }

}
