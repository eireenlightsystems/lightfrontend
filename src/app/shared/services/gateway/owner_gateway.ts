import {Injectable} from '@angular/core'
import {HttpClient} from '@angular/common/http'
import {Owner_gateway} from '../../interfaces'
import {Observable} from 'rxjs/index'

@Injectable({
  providedIn: 'root'
})
export class Owner_gatewayService {
  constructor(private http: HttpClient) {
  }
  fetch(): Observable<Owner_gateway[]> {
    return this.http.get<Owner_gateway[]>('/api/owner_gateway')
  }

}
