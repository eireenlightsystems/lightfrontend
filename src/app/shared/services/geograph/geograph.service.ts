import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs/index';

import {Geograph, GeographFias, Person} from '../../interfaces';

@Injectable({
  providedIn: 'root'
})
export class GeographService {
  constructor(private http: HttpClient) {
  }

  fetch(): Observable<Geograph[]> {
    return this.http.get<Geograph[]>('/api/v1/geographs');
  }

  insFias(geographFias: GeographFias): Observable<GeographFias> {
    return this.http.post<GeographFias>('/api/v1/geographfiases', geographFias);
  }

}
