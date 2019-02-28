import {Injectable} from '@angular/core'
import {HttpClient, HttpParams} from '@angular/common/http'
import {CommandStatus} from '../../interfaces'
import {Observable} from 'rxjs/index'

@Injectable({
  providedIn: 'root'
})
export class CommandStatusService {
  constructor(private http: HttpClient) {
  }
  fetch(): Observable<CommandStatus[]> {
    return this.http.get<CommandStatus[]>('/api/command_status')
  }

}
