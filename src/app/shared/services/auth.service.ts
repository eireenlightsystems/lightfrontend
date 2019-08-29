// @ts-ignore
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {User} from '../interfaces';
import {tap} from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private token = null;
  private strLogin = null;

  constructor(private http: HttpClient) {
  }

  register(user: User): Observable<User> {
    return this.http.post<User>('/api/auth/register', user);
  }

  login(user: User): Observable<{ token: string }> {
    return this.http.post<{ token: string }>('/api/v1/auth/login', user)
      .pipe(
        tap(
          ({token}) => {
            localStorage.setItem('auth-token', token);
            this.setToken(token);
            localStorage.setItem('login', user.login);
            this.setLogin(user.login);
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
    this.setLogin(null);
    this.clearLogin();
    localStorage.clear();
  }

  setLogin(login: string) {
    this.strLogin = login;
  }

  getLogin(): string {
    return this.strLogin;
  }

  clearLogin() {
    this.setLogin(null);
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  logout() {
    // Токен чистится в компоненте выхова
    // this.clearToken();
    return this.http.post('/api/v1/auth/logout', null)
      .pipe(
        tap(
          () => {
          }
        )
      );
  }
}
