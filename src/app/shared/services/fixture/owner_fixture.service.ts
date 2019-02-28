import {Injectable} from '@angular/core'
import {HttpClient, HttpParams} from '@angular/common/http'
import {Owner_fixture} from '../../interfaces'
import {Observable} from 'rxjs/index'

@Injectable({
  providedIn: 'root'
})
export class Owner_fixtureService {
  constructor(private http: HttpClient) {
  }
  fetch(): Observable<Owner_fixture[]> {
    return this.http.get<Owner_fixture[]>('/api/owner_fixture')
  }

}
