import {Injectable} from '@angular/core'
import {HttpClient, HttpParams} from '@angular/common/http'
import {Owner_node} from '../../interfaces'
import {Observable} from 'rxjs/index'

@Injectable({
  providedIn: 'root'
})
export class Owner_nodeService {
  constructor(private http: HttpClient) {
  }
  fetch(): Observable<Owner_node[]> {
    return this.http.get<Owner_node[]>('/api/owner_node')
  }

}
