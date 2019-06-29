import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs/index';

import {EquipmentType, Message, FixtureType} from '../../interfaces';

@Injectable({
  providedIn: 'root'
})
export class FixtureTypeService {
  constructor(private http: HttpClient) {
  }

  // fetch(): Observable<EquipmentType[]> {
  //   return this.http.get<EquipmentType[]>('/api/v1/fixtures-types');
  // }

  // get

  getAll(params: any = {}): Observable<FixtureType[]> {
    return this.http.get<FixtureType[]>('/api/v1/fixtures-types', {
      params: new HttpParams({
        fromObject: params
      })
    });
  }

  // post

  ins(fixtureType: FixtureType): Observable<FixtureType> {
    return this.http.post<FixtureType>('/api/v1/fixtures-types', fixtureType);
  }

  // patch

  upd(fixtureType: FixtureType): Observable<FixtureType> {
    return this.http.patch<FixtureType>('/api/v1/fixtures-types', fixtureType);
  }

  // delete

  del(id_fixtureType: number): Observable<Message> {
    return this.http.delete<Message>(`/api/v1/fixtures-types/${id_fixtureType}`);
  }

}
