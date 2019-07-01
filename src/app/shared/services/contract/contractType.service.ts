import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs/index';

import {ContractType, Message} from '../../interfaces';

@Injectable({
  providedIn: 'root'
})
export class ContractTypeService {
  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: HttpClient) {
  }

  // get

  getAll(params: any = {}): Observable<ContractType[]> {
    return this.http.get<ContractType[]>('/api/v1/contracts-types', {
      params: new HttpParams({
        fromObject: params
      })
    });
  }

  // post

  ins(contractType: ContractType): Observable<ContractType> {
    return this.http.post<ContractType>('/api/v1/contracts-types', contractType);
  }

  // patch

  upd(contractType: ContractType): Observable<ContractType> {
    return this.http.patch<ContractType>('/api/v1/contracts-types', contractType);
  }

  // delete

  del(contractTypeId: number): Observable<Message> {
    return this.http.delete<Message>(`/api/v1/contracts-types/${contractTypeId}`);
  }

}
