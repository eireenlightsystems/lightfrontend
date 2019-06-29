import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs/index';

import {Message, CompanyDepartment} from '../../interfaces';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  constructor(private http: HttpClient) {
  }

  // get

  getAll(params: any = {}): Observable<CompanyDepartment[]> {
    return this.http.get<CompanyDepartment[]>('/api/v1/companies', {
      params: new HttpParams({
        fromObject: params
      })
    });
  }

  // post

  ins(company: CompanyDepartment): Observable<CompanyDepartment> {
    return this.http.post<CompanyDepartment>('/api/v1/companies', company);
  }

  // patch

  upd(company: CompanyDepartment): Observable<CompanyDepartment> {
    return this.http.patch<CompanyDepartment>('/api/v1/companies', company);
  }

  // delete

  del(companyId: number): Observable<Message> {
    return this.http.delete<Message>(`/api/v1/companies/${companyId}`);
  }

}
