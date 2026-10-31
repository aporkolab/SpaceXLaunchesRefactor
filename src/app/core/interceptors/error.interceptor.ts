import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

/**
 * Logs every failed HTTP call in one place and re-throws the error so callers
 * can still react to it (e.g. by switching to an error state).
 */
export const errorInterceptor: HttpInterceptorFn = (request, next) =>
  next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      console.error('HTTP Error caught by Interceptor:', error);
      return throwError(() => error);
    }),
  );
