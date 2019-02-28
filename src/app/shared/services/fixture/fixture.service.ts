import {Injectable} from '@angular/core'
import {HttpClient, HttpParams} from '@angular/common/http'
import {Fixture, Message, Node} from '../../interfaces'
import {Observable} from 'rxjs/index'

@Injectable({
  providedIn: 'root'
})
export class FixtureService {

  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: HttpClient) {
  }

  getAll(params: any = {}): Observable<Fixture[]> {
    return this.http.get<Fixture[]>('/api/fixture', {
      params: new HttpParams({
        fromObject: params
      })
    })
  }

  ins(fixture: Fixture): Observable<Fixture> {
    return this.http.post<Fixture>('/api/fixture', fixture)
  }

  upd(fixture: Fixture): Observable<Fixture> {
    return this.http.patch<Fixture>('/api/fixture', fixture)
  }

  set_id_node(fixture: Fixture): Observable<Fixture> {
    return this.http.patch<Fixture>('/api/fixture/set_id_node', fixture)
  }

  del(id_fixture: number): Observable<Message> {
    return this.http.delete<Message>(`/api/fixture/${id_fixture}`)
  }
}
