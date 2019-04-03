import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs/index';

import {CommandStatus} from '../../interfaces';

@Injectable({
  providedIn: 'root'
})
export class CommandStatusService {
  constructor(private http: HttpClient) {
  }

  fetch(): Observable<CommandStatus[]> {
    return this.http.get<CommandStatus[]>('/api2/fixtures-commands-statuses');
  }

}
