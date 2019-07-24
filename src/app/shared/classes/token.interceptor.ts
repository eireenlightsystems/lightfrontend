// @ts-ignore
import {Injectable} from '@angular/core';
import {AuthService} from '../services/auth.service';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.auth.isAuthenticated()) {
      if (req.url.substring(0, 19) === 'https://suggestions') {
        req = req.clone({
          setHeaders: {
            Authorization: localStorage.getItem('suggestions-token')
          }
        });
      } else {
        req = req.clone({
          setHeaders: {
            Authorization: this.auth.getToken()
          }
        });
      }
    }
    return next.handle(req);
  }
}
