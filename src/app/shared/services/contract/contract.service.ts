import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs/index';

import {Contract, Message} from '../../interfaces';

@Injectable({
  providedIn: 'root'
})
export class ContractService {
  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: HttpClient) {
  }

  // get

  getAll(params: any = {}): Observable<Contract[]> {
    return this.http.get<Contract[]>('/api/v1/contracts', {
      params: new HttpParams({
        fromObject: params
      })
    });
  }

  // post

  ins(contract: Contract): Observable<Contract> {
    return this.http.post<Contract>('/api/v1/contracts', contract);
  }

  // patch

  upd(contract: Contract): Observable<Contract> {
    return this.http.patch<Contract>('/api/v1/contracts', contract);
  }

  // delete

  del(contractId: number): Observable<Message> {
    return this.http.delete<Message>(`/api/v1/contracts/${contractId}`);
  }

}
