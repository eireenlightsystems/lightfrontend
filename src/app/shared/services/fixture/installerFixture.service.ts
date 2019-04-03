import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs/index';

import {Installer} from '../../interfaces';

@Injectable({
  providedIn: 'root'
})
export class InstallerFixtureService {
  constructor(private http: HttpClient) {
  }

  fetch(): Observable<Installer[]> {
    return this.http.get<Installer[]>('/api2/fixtures-installers');
  }

}
