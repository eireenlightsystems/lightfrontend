import {Injectable} from '@angular/core'
import {HttpClient, HttpParams} from '@angular/common/http'
import {NodeType} from '../../interfaces'
import {Observable} from 'rxjs/index'

@Injectable({
  providedIn: 'root'
})
export class NodeTypeService {
  constructor(private http: HttpClient) {
  }
  fetch(): Observable<NodeType[]> {
    return this.http.get<NodeType[]>('/api/nodeType')
  }

}
