import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs/index';

import {FixtureType} from '../../interfaces';

@Injectable({
  providedIn: 'root'
})
export class FixtureTypeService {
  constructor(private http: HttpClient) {
  }

  fetch(): Observable<FixtureType[]> {
    return this.http.get<FixtureType[]>('/api2/fixtures-types');
  }

}
