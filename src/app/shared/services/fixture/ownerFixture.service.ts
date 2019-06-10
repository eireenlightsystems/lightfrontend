import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs/index';

import {Owner} from '../../interfaces';

@Injectable({
  providedIn: 'root'
})
export class OwnerFixtureService {
  constructor(private http: HttpClient) {
  }

  fetch(): Observable<Owner[]> {
    return this.http.get<Owner[]>('/api/v1/fixtures-owners');
  }

}
