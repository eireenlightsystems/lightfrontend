import {Injectable} from '@angular/core'
import {HttpClient, HttpParams} from '@angular/common/http'
import {Observable} from 'rxjs/index'

import {SpeedDirection} from '../../interfaces'

@Injectable({
  providedIn: 'root'
})
export class SpeedDirectionService {
  constructor(private http: HttpClient) {
  }

  fetch(): Observable<SpeedDirection[]> {
    return this.http.get<SpeedDirection[]>('/api/speedDirection')
  }

}
