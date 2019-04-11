import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs/index';

import {CommandSpeedSwitchDflt, CommandSpeedSwitch} from '../../interfaces';


@Injectable({
  providedIn: 'root'
})
export class CommandSpeedSwitchService {

  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: HttpClient) {
  }

  getAll(params: any = {}): Observable<CommandSpeedSwitch[]> {
    return this.http.get<CommandSpeedSwitch[]>(`/api2/fixtures-lightspeed-commands`, {
        params: new HttpParams({
          fromObject: params
        })
      }
    );
  }

  send(commandSpeedSwitch: CommandSpeedSwitch[]): Observable<CommandSpeedSwitch[]> {
    return this.http.post<CommandSpeedSwitch[]>('/api2/fixtures-lightspeed-commands', commandSpeedSwitch);
  }

  del(params: any []): any {
    const options = {
      headers: new HttpHeaders({}),
      body: JSON.stringify(params)
    };
    return this.http.delete(`/api2/fixtures-lightspeed-commands`, options);
  }

  dfltParams(): CommandSpeedSwitchDflt {
    const commandSpeedSwitchDflt: CommandSpeedSwitchDflt = new CommandSpeedSwitchDflt();
    commandSpeedSwitchDflt.statusId = 3;
    return commandSpeedSwitchDflt;
  }
}
