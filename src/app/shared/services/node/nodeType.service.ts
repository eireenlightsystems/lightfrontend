import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs/index';

import {NodeType} from '../../interfaces';

@Injectable({
  providedIn: 'root'
})
export class NodeTypeService {
  constructor(private http: HttpClient) {
  }

  fetch(): Observable<NodeType[]> {
    return this.http.get<NodeType[]>('/api2/nodes-types');
  }

}
