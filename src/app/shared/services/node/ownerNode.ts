import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs/index';

import {OwnerNode} from '../../interfaces';

@Injectable({
  providedIn: 'root'
})
export class OwnerNodeService {
  constructor(private http: HttpClient) {
  }

  fetch(): Observable<OwnerNode[]> {
    return this.http.get<OwnerNode[]>('/api2/nodes-owners');
  }

}
