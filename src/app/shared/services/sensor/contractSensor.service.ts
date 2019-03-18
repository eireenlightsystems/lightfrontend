import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Contract} from '../../interfaces';
import {Observable} from 'rxjs/index';

@Injectable({
  providedIn: 'root'
})
export class ContractSensorService {
  constructor(private http: HttpClient) {
  }

  fetch(): Observable<Contract[]> {
    return this.http.get<Contract[]>('/api/contract-sensor');
  }

}
