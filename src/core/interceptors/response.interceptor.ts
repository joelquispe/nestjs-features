import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
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
        // Si el error es una instancia de HttpException, accedemos a sus propiedades
        const statusCode = err instanceof HttpException ? err.getStatus() : 500;
        const responseMessage =
          err instanceof HttpException ? err.getResponse() : err;

        response.status(statusCode);

        // Retorna la respuesta formateada
        return new Observable((subscriber) => {
          subscriber.next({
            statusCode,
            error: responseMessage,
            message: responseMessage?.message || 'Internal server error', // Aquí se ajusta el mensaje
          });
          subscriber.complete();
        });
      }),
    );
  }
}
