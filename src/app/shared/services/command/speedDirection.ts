import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs/index';

import {CommandType} from '../../interfaces';

@Injectable({
  providedIn: 'root'
})
export class SpeedDirectionService {
  constructor(private http: HttpClient) {
  }

  fetch(): Observable<CommandType[]> {
    return this.http.get<CommandType[]>('/api/v1/fixtures-lightspeed-commands-types');
  }

}
