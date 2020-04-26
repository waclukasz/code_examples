import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environment';
import {
  AuthenticationResponse,
  TokenPayload
} from '@models';
import { CookieService } from 'ngx-cookie';
import {
  BehaviorSubject,
  Observable
} from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  public token: Observable<string>;
  private tokenSubject: BehaviorSubject<string>;

  constructor(private http: HttpClient, private cookieService: CookieService) {
    this.tokenSubject = new BehaviorSubject<string>(
      this.cookieService.get('token')
    );

    this.token = this.tokenSubject.asObservable();
  }

  public get sessionToken(): string {
    return this.tokenSubject.value;
  }

  public getToken(): Observable<string> {
    const payload: TokenPayload = {
      request: {
        type: 'b2c', // Todo with other flows
        account_name: environment.accountName,
        account_token: environment.accountPassword,
        client_device: 'web_browser',
      },
    };

    return this.http.post<AuthenticationResponse>('token/get', payload).pipe(
      map((data: AuthenticationResponse) => {
        const {
          response: { token },
        } = data;
        const expirationTime = 3600000; // 1h
        const expiresIn: Date = new Date(Date.now() + expirationTime);
        this.cookieService.put('token', token, { expires: expiresIn });
        return token;
      })
    );
  }
}
