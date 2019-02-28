import {Injectable} from '@angular/core'
import {HttpClient} from '@angular/common/http'
import {Observable} from 'rxjs'
import {User} from '../interfaces'
import {tap} from 'rxjs/operators'
import {MaterialService} from "../classes/material.service";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private token = null

  constructor(private http: HttpClient) {
  }

  register(user: User): Observable<User> {
    return this.http.post<User>('/api/auth/register', user)
  }

  login(user: User): Observable<{ token: string, message: string }> {
    return this.http.post<{ token: string, message: string }>('/api/auth/login', user)
      .pipe(
        tap(
          ({token, message}) => {
            localStorage.setItem('auth-token', token)
            this.setToken(token)
            MaterialService.toast(message)
            console.warn(message)
          }
        )
      )
  }

  setToken(token: string) {
    this.token = token
  }

  getToken(): string {
    return this.token
  }

  clearToken() {
    this.setToken(null)
    localStorage.clear()
  }

  isAuthenticated(): boolean {
    return !!this.token
  }

  logout() {
    //Токен чистится в компоненте выхова
    //this.clearToken();
    return this.http.post<{ message: string }>('/api/auth/logout', null)
      .pipe(
        tap(
          ({message}) => {
            MaterialService.toast(message)
            console.warn(message)
          }
        )
      )
  }
}
