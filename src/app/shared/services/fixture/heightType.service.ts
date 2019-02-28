import {Injectable} from '@angular/core'
import {HttpClient, HttpParams} from '@angular/common/http'
import {HeightType} from '../../interfaces'
import {Observable} from 'rxjs/index'

@Injectable({
  providedIn: 'root'
})
export class HeightTypeService {
  constructor(private http: HttpClient) {
  }
  fetch(): Observable<HeightType[]> {
    return this.http.get<HeightType[]>('/api/heightType')
  }

}
