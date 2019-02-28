import {Injectable} from '@angular/core'
import {HttpClient, HttpParams} from '@angular/common/http'
import {FixtureType} from '../../interfaces'
import {Observable} from 'rxjs/index'

@Injectable({
  providedIn: 'root'
})
export class FixtureTypeService {
  constructor(private http: HttpClient) {
  }
  fetch(): Observable<FixtureType[]> {
    return this.http.get<FixtureType[]>('/api/fixtureType')
  }

}
