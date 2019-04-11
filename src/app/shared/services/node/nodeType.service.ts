import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs/index';

import {EquipmentType} from '../../interfaces';

@Injectable({
  providedIn: 'root'
})
export class NodeTypeService {
  constructor(private http: HttpClient) {
  }

  fetch(): Observable<EquipmentType[]> {
    return this.http.get<EquipmentType[]>('/api2/nodes-types');
  }

}
