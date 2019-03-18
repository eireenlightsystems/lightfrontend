import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs/index';

import {CommandSwitch} from '../../interfaces';
import {CommandSwitchDflt} from '../../models/command/commandSwitchDflt';

@Injectable({
  providedIn: 'root'
})
export class CommandSwitchService {

  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: HttpClient) {
  }

  getAll(params: any = {}): Observable<CommandSwitch[]> {
    return this.http.get<CommandSwitch[]>(`/api2/fixture/command/lightlevel`, {
        params: new HttpParams({
          fromObject: params
        })
      }
    );
  }

  send(сommandSwitch: CommandSwitch[]): Observable<CommandSwitch[]> {
    return this.http.post<CommandSwitch[]>('/api2/fixture/command/lightlevel', сommandSwitch);
  }

  del(params: any []): any {
    const options = {
      headers: new HttpHeaders({}),
      body: JSON.stringify(params)
    };
    return this.http.delete(`/api2/fixture/command`, options);
  }

  dfltParams(): CommandSwitchDflt {
    const commandSwitchDflt: CommandSwitchDflt = new CommandSwitchDflt();
    commandSwitchDflt.statusId = 3;
    return commandSwitchDflt;
  }
}
