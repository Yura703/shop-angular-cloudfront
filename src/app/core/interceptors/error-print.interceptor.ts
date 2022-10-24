import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { NotificationService } from '../notification.service';
import { tap } from 'rxjs/operators';

@Injectable()
export class ErrorPrintInterceptor implements HttpInterceptor {
  constructor(private readonly notificationService: NotificationService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      tap({
        error: (err: unknown) => {
          const url = new URL(request.url);
          const status = (err as HttpErrorResponse).status;

          switch (status) {
            case 401:
              this.notificationService.showError('401: Not authorized', 0);
              break;

            case 403:
              this.notificationService.showError('403. Access is forbidden', 0);
              break;

            default:
              this.notificationService.showError(
                `Request to "${url.pathname}" failed. Check the console for the details`,
                0
              );
              break;
          }
        },
      })
    );
  }
}
