import {Injectable} from '@angular/core'
import {HttpClient, HttpParams} from '@angular/common/http'
import {CommandType} from '../../interfaces'
import {Observable} from 'rxjs/index'

@Injectable({
  providedIn: 'root'
})
export class CommandTypeService {
  constructor(private http: HttpClient) {
  }
  fetch(): Observable<CommandType[]> {
    return this.http.get<CommandType[]>('/api/commandType')
  }

}
