import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {User} from '../interfaces';
import {tap} from 'rxjs/operators';
import {MaterialService} from '../classes/material.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private token = null;

  constructor(private http: HttpClient) {
  }

  register(user: User): Observable<User> {
    return this.http.post<User>('/api/auth/register', user);
  }

  login(user: User): Observable<{ token: string }> {
    return this.http.post<{ token: string }>('/api2/auth/login', user)
      .pipe(
        tap(
          ({token}) => {
            localStorage.setItem('auth-token', token);
            this.setToken(token);
            // MaterialService.toast('Авторизация пройдена');
          }
        )
      );
  }

  setToken(token: string) {
    this.token = token;
  }

  getToken(): string {
    return this.token;
  }

  clearToken() {
    this.setToken(null);
    localStorage.clear();
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  logout() {
    // Токен чистится в компоненте выхова
    // this.clearToken();
    return this.http.post('/api2/auth/logout', null)
      .pipe(
        tap(
          () => {
            // MaterialService.toast('');
          }
        )
      );
  }
}
