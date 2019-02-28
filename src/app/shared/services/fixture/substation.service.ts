import {Injectable} from '@angular/core'
import {HttpClient, HttpParams} from '@angular/common/http'
import {Substation} from '../../interfaces'
import {Observable} from 'rxjs/index'

@Injectable({
  providedIn: 'root'
})
export class SubstationService {
  constructor(private http: HttpClient) {
  }
  fetch(): Observable<Substation[]> {
    return this.http.get<Substation[]>('/api/substation')
  }

}
