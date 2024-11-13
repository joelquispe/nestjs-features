import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable()
export class ResponseFormatInterceptor<T> implements NestInterceptor<T> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const response = context.switchToHttp().getResponse();

    return next.handle().pipe(
      map((data) => ({
        statusCode: response.statusCode,
        data,
        message: 'Request successful',
        error: null,
      })),
      catchError((err) => {
        const statusCode = err.status || 500;
        response.status(statusCode);
        return new Observable((subscriber) => {
          subscriber.next(err.response || err);
          subscriber.complete();
        });
      }),
    );
  }
}
