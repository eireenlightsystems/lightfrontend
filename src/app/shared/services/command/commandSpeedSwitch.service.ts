import {Injectable} from '@angular/core'
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http'
import {Observable} from 'rxjs/index'

import {CommandSpeedSwitch} from '../../interfaces'
import {CommandSpeedSwitchDflt} from "../../models/command/commandSpeedSwitchDflt";


@Injectable({
  providedIn: 'root'
})
export class CommandSpeedSwitchService {

  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: HttpClient) {
  }

  send(commandSpeedSwitch: CommandSpeedSwitch[]): Observable<CommandSpeedSwitch[]> {
    return this.http.post<CommandSpeedSwitch[]>('/api2/fixture/command/lightspeed', commandSpeedSwitch)
  }

  getAll(params: any = {}): Observable<CommandSpeedSwitch[]> {
    return this.http.get<CommandSpeedSwitch[]>(`/api2/fixture/command/lightspeed`, {
        params: new HttpParams({
          fromObject: params
        })
      }
    )
  }

  del(params: any []): any {
    let options = {
      headers: new HttpHeaders({}),
      body: JSON.stringify(params)
    }
    return this.http.delete(`/api2/fixture/command`, options)
  }

  dfltParams(): CommandSpeedSwitchDflt {
    let commandSpeedSwitchDflt: CommandSpeedSwitchDflt = new CommandSpeedSwitchDflt()
    commandSpeedSwitchDflt.statusId = 3
    return commandSpeedSwitchDflt
  }
}
