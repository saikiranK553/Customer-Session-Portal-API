import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';

import { Injectable } from '@angular/core';

import { Observable, catchError, throwError } from 'rxjs';
import { ISession } from 'src/app/features/models/session.model';

@Injectable({
  providedIn: 'root',
})
export class SessionInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<ISession>,
    next: HttpHandler
  ): Observable<HttpEvent<ISession>> {
    console.log(req);
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(error);
      })
    );
  }
}
