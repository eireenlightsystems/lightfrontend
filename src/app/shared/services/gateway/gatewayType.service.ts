import {Injectable} from '@angular/core'
import {HttpClient} from '@angular/common/http'
import {GatewayType} from '../../interfaces'
import {Observable} from 'rxjs/index'

@Injectable({
  providedIn: 'root'
})
export class GatewayTypeService {
  constructor(private http: HttpClient) {
  }
  fetch(): Observable<GatewayType[]> {
    return this.http.get<GatewayType[]>('/api/gatewayType')
  }

}
