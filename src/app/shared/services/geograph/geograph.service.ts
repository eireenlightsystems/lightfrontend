import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs/index';

import {Geograph} from '../../interfaces';

@Injectable({
  providedIn: 'root'
})
export class GeographService {
  constructor(private http: HttpClient) {
  }

  fetch(): Observable<Geograph[]> {
    return this.http.get<Geograph[]>('/api/v1/geographs');
  }

}
