import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs/index';

import {Substation} from '../../interfaces';

@Injectable({
  providedIn: 'root'
})
export class SubstationService {
  constructor(private http: HttpClient) {
  }

  fetch(): Observable<Substation[]> {
    return this.http.get<Substation[]>('/api/v1/substations');
  }

}
