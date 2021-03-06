import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs/index';

import {FixtureGroup, Owner, FixtureGroupType, Message} from '../../interfaces';

@Injectable({
  providedIn: 'root'
})
export class FixtureGroupService {

  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: HttpClient) {
  }


  // get

  getAll(params: any = {}): Observable<FixtureGroup[]> {
    return this.http.get<FixtureGroup[]>('/api/v1/fixtures-groups', {
      params: new HttpParams({
        fromObject: params
      })
    });
  }

  getFixtureGroupTypeAll(): Observable<FixtureGroupType[]> {
    return this.http.get<FixtureGroupType[]>('/api/v1/fixtures-groups-types');
  }

  getFixtureGroupOwnerAll(): Observable<Owner[]> {
    return this.http.get<Owner[]>('/api/v1/fixtures-groups-owners');
  }

  // post

  ins(fixtureGroup: FixtureGroup): Observable<FixtureGroup> {
    return this.http.post<FixtureGroup>('/api/v1/fixtures-groups', fixtureGroup);
  }

  // patch

  upd(fixtureGroup: FixtureGroup): Observable<FixtureGroup> {
    return this.http.patch<FixtureGroup>('/api/v1/fixtures-groups', fixtureGroup);
  }

  // delete

  del(fixtureGroupId: number): Observable<Message> {
    return this.http.delete<Message>(`/api/v1/fixtures-groups/${fixtureGroupId}`);
  }
}
