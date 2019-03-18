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

  getAll(params: any = {}): Observable<Fixture[]> {
    return this.http.get<Fixture[]>('/api/fixture', {
      params: new HttpParams({
        fromObject: params
      })
    });
  }

  getFixtureInGroupAll(params: any = {}): Observable<Fixture[]> {
    return this.http.get<Fixture[]>('/api/fixture/get-fixture-in-group', {
      params: new HttpParams({
        fromObject: params
      })
    });
  }

  // getFixtureNotInThisGroup(fixtureGroupId: number): Observable<Fixture[]> {
  //   return this.http.get<Fixture[]>(`/api/fixture/get-fixture-not-in-this-group/${fixtureGroupId}`);
  // }

  getFixtureNotInThisGroup(params: any = {}): Observable<Fixture[]> {
    return this.http.get<Fixture[]>('/api/fixture/get-fixture-not-in-this-group', {
      params: new HttpParams({
        fromObject: params
      })
    });
  }


  ins(fixture: Fixture): Observable<Fixture> {
    return this.http.post<Fixture>('/api/fixture', fixture);
  }

  upd(fixture: Fixture): Observable<Fixture> {
    return this.http.patch<Fixture>('/api/fixture', fixture);
  }

  set_id_node(fixture: Fixture): Observable<Fixture> {
    return this.http.patch<Fixture>('/api/fixture/set_id_node', fixture);
  }

  del(id_fixture: number): Observable<Message> {
    return this.http.delete<Message>(`/api/fixture/${id_fixture}`);
  }

  // setFixtureInGroup(fixtureGroupId: number, fixtureId: number): Observable<any> {
  //   // @ts-ignore
  //   return this.http.post<any>(`/api2/fixture-group/${fixtureGroupId}/item/${fixtureId}`);
  // }

  setFixtureInGroup(fixtureGroupId: number, fixtureIds: number[]): Observable<any> {
    const options = JSON.stringify(fixtureIds);
    return this.http.post<any>(`/api2/fixture-group/${fixtureGroupId}/item`, options);
  }

  // delFixtureInGroup(fixtureGroupId: number, fixtureId: number): Observable<any> {
  //   return this.http.delete<any>(`/api2/fixture-group/${fixtureGroupId}/item/${fixtureId}`);
  // }

  delFixtureInGroup(fixtureGroupId: number, fixtureIds: number[]): Observable<any> {
    const options = {
      headers: new HttpHeaders({}),
      body: JSON.stringify(fixtureIds)
    };
    return this.http.delete<any>(`/api2/fixture-group/${fixtureGroupId}/item`, options);
  }
}
