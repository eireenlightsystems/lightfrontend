import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs/index';

import {EquipmentType, Fixture, Message} from '../../interfaces';

@Injectable({
  providedIn: 'root'
})
export class FixtureService {

  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: HttpClient) {
  }

  // get

  getAll(params: any = {}): Observable<Fixture[]> {
    return this.http.get<Fixture[]>('/api/v1/fixtures', {
      params: new HttpParams({
        fromObject: params
      })
    });
  }

  getFixtureInGroup(fixtureGroupId: string): Observable<Fixture[]> {
    return this.http.get<Fixture[]>(`/api/v1/fixtures-groups/${fixtureGroupId}/fixtures`);
  }

  getFixtureTypes(): Observable<EquipmentType[]> {
    return this.http.get<EquipmentType[]>('/api/v1/fixtures-types');
  }

  // post

  ins(fixture: Fixture): Observable<Fixture> {
    return this.http.post<Fixture>('/api/v1/fixtures', fixture);
  }

  setFixtureInGroup(fixtureGroupId: number, fixtureIds: number[]): Observable<any> {
    const options = JSON.stringify(fixtureIds);
    return this.http.post<any>(`/api/v1/fixtures-groups/${fixtureGroupId}/fixtures`, options);
  }

  setNodeId(nodeId: number, fixtureIds: number[]): Observable<any> {
    const options = JSON.stringify(fixtureIds);
    return this.http.post<any>(`/api/v1/nodes/${nodeId}/fixtures`, options);
  }

  // patch

  upd(fixture: Fixture): Observable<Fixture> {
    return this.http.patch<Fixture>('/api/v1/fixtures', fixture);
  }

  // delete

  delFixtureInGroup(fixtureGroupId: number, fixtureIds: number[]): Observable<any> {
    const options = {
      headers: new HttpHeaders({}),
      body: JSON.stringify(fixtureIds)
    };
    return this.http.delete<any>(`/api/v1/fixtures-groups/${fixtureGroupId}/fixtures`, options);
  }

  delNodeId(nodeId: number, fixtureIds: number[]): Observable<any> {
    const options = {
      headers: new HttpHeaders({}),
      body: JSON.stringify(fixtureIds)
    };
    return this.http.delete<any>(`/api/v1/nodes/${nodeId}/fixtures`, options);
  }

  del(id_fixture: number): Observable<Message> {
    return this.http.delete<Message>(`/api/v1/fixtures/${id_fixture}`);
  }
}
