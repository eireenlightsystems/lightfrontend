import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs/index';

import {OwnerFixture} from '../../interfaces';

@Injectable({
  providedIn: 'root'
})
export class OwnerFixtureService {
  constructor(private http: HttpClient) {
  }

  fetch(): Observable<OwnerFixture[]> {
    return this.http.get<OwnerFixture[]>('/api2/fixtures-owners');
  }

}
