import {Injectable} from '@angular/core'
import {HttpClient, HttpParams} from '@angular/common/http'
import {Installer} from '../../interfaces'
import {Observable} from 'rxjs/index'

@Injectable({
  providedIn: 'root'
})
export class Installer_fixtureService {
  constructor(private http: HttpClient) {
  }
  fetch(): Observable<Installer[]> {
    return this.http.get<Installer[]>('/api/installer_fixture')
  }

}
