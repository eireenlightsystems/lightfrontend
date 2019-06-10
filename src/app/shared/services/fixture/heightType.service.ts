import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs/index';

import {HeightType} from '../../interfaces';

@Injectable({
  providedIn: 'root'
})
export class HeightTypeService {
  constructor(private http: HttpClient) {
  }

  fetch(): Observable<HeightType[]> {
    return this.http.get<HeightType[]>('/api/v1/fixtures-height-types');
  }

}
