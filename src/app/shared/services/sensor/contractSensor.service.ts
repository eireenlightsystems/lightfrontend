import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/index';

import {Contract} from '../../interfaces';

@Injectable({
  providedIn: 'root'
})
export class ContractSensorService {
  constructor(private http: HttpClient) {
  }

  fetch(): Observable<Contract[]> {
    return this.http.get<Contract[]>('/api/v1/sensors-contracts');
  }

}
