import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs/index';

import {ReportCountFixture, ReportPowerFixture} from '../../interfaces';


@Injectable({
  providedIn: 'root'
})
export class ReportFixtureService {

  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: HttpClient) {
  }

  // get

  getReportCountFixture(params: any = {}): Observable<ReportCountFixture[]> {
    return this.http.get<ReportCountFixture[]>('/api/v1/report-count-fixtures', {
      params: new HttpParams({
        fromObject: params
      })
    });
  }

  getReportPowerFixture(params: any = {}): Observable<ReportPowerFixture[]> {
    return this.http.get<ReportPowerFixture[]>('/api/v1/report-power-fixtures', {
      params: new HttpParams({
        fromObject: params
      })
    });
  }

}
