import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs/index';

import {FixtureGroup, FixtureGroupOwner, FixtureGroupType, Message} from '../../interfaces';

@Injectable({
  providedIn: 'root'
})
export class FixtureGroupService {

  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: HttpClient) {
  }

  // getAll(params: any = {}): Observable<FixtureGroup[]> {
  //   const httpParams = new HttpParams();
  //
  //   // httpParams.set('ownerId', params.ownwerId === null ? null : params.ownwerId);
  //   httpParams.set('fixtureGroupTypeId', params.fixtureGroupTypeId.toString()).toString();
  //
  //   // params.ownwerId === null ? null : params.ownwerId
  //   // params.fixtureGroupTypeId === null ? null : params.fixtureGroupTypeId
  //
  //   console.log(httpParams);
  //
  //   return this.http.get<FixtureGroup[]>('/api2/fixture-group', {
  //     params: httpParams
  //   });
  // }

  getAll(params: any = {}): Observable<FixtureGroup[]> {
     return this.http.get<FixtureGroup[]>('/api2/fixture-group', {
      params: new HttpParams({
        fromObject: params
      })
    });
  }

  // getAll(params: any = {}): Observable<FixtureGroup[]> {
  //   return this.http.get<FixtureGroup[]>('/api2/fixture-group?ownerId=0&fixtureGroupTypeId=0');
  // }

  getFixtureGroupTypeAll(): Observable<FixtureGroupType[]> {
    return this.http.get<FixtureGroupType[]>('/api2/fixture-group-type');
  }

  getFixtureGroupOwnerAll(): Observable<FixtureGroupOwner[]> {
    return this.http.get<FixtureGroupOwner[]>('/api2/fixture-group-owner');
  }

  ins(fixtureGroup: FixtureGroup): Observable<FixtureGroup> {
    return this.http.post<FixtureGroup>('/api2/fixture-group', fixtureGroup);
  }

  upd(fixtureGroup: FixtureGroup): Observable<FixtureGroup> {
    return this.http.patch<FixtureGroup>('/api2/fixture-group', fixtureGroup);
  }

  del(fixtureGroupId: number): Observable<Message> {
    return this.http.delete<Message>(`/api2/fixture-group/${fixtureGroupId}`);
  }
}
