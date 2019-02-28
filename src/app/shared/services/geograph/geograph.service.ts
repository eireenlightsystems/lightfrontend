import {Injectable} from '@angular/core'
import {HttpClient, HttpParams} from '@angular/common/http'
import {Geograph} from '../../interfaces'
import {Observable} from 'rxjs/index'

@Injectable({
  providedIn: 'root'
})
export class GeographService {
  constructor(private http: HttpClient) {
  }
  fetch(): Observable<Geograph[]> {
    return this.http.get<Geograph[]>('/api/geograph')
  }

}
