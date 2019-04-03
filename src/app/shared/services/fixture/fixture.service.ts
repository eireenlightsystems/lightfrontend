import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs/index';

import {Fixture, Message} from '../../interfaces';

@Injectable({
  providedIn: 'root'
})
export class FixtureService {

  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: HttpClient) {
  }

  // get

  getAll(params: any = {}): Observable<Fixture[]> {
    return this.http.get<Fixture[]>('/api2/fixtures', {
      params: new HttpParams({
        fromObject: params
      })
    });
  }

  getFixtureInGroup(fixtureGroupId: string): Observable<Fixture[]> {
    return this.http.get<Fixture[]>(`/api2/fixtures-groups/${fixtureGroupId}/fixtures`);
  }

  // post

  ins(fixture: Fixture): Observable<Fixture> {
    return this.http.post<Fixture>('/api2/fixtures', fixture);
  }

  setFixtureInGroup(fixtureGroupId: number, fixtureIds: number[]): Observable<any> {
    const options = JSON.stringify(fixtureIds);
    return this.http.post<any>(`/api2/fixtures-groups/${fixtureGroupId}/fixtures`, options);
  }

  setNodeId(nodeId: number, fixtureIds: number[]): Observable<any> {
    const options = JSON.stringify(fixtureIds);
    return this.http.post<any>(`/api2/nodes/${nodeId}/fixtures`, options);
  }

  // patch

  upd(fixture: Fixture): Observable<Fixture> {
    return this.http.patch<Fixture>('/api2/fixtures', fixture);
  }

  // delete

  delFixtureInGroup(fixtureGroupId: number, fixtureIds: number[]): Observable<any> {
    const options = {
      headers: new HttpHeaders({}),
      body: JSON.stringify(fixtureIds)
    };
    return this.http.delete<any>(`/api2/fixtures-groups/${fixtureGroupId}/fixtures`, options);
  }

  delNodeId(nodeId: number, fixtureIds: number[]): Observable<any> {
    const options = {
      headers: new HttpHeaders({}),
      body: JSON.stringify(fixtureIds)
    };
    return this.http.delete<any>(`/api2/nodes/${nodeId}/fixtures`, options);
  }

  del(id_fixture: number): Observable<Message> {
    return this.http.delete<Message>(`/api2/fixtures/${id_fixture}`);
  }
}
