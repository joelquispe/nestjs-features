import { HttpException, HttpStatus } from '@nestjs/common';
import { AxiosError } from 'axios';

interface ErrorResponse {
  message: string;
  error: string;
  status: number;
  cause: any[];
}

export class HandleErrorUtil extends HttpException {
  constructor({
    type,
    message,
  }: {
    type: HttpStatus | keyof typeof HttpStatus; // Acepta tanto claves como valores numéricos
    message: string;
  }) {
    // Si 'type' es una clave, obtiene el valor correspondiente del código de estado HTTP
    const status =
      typeof type === 'number'
        ? type
        : HttpStatus[type] || HttpStatus.INTERNAL_SERVER_ERROR;
    super(message, status);
  }

  public static createSignatureError(error: AxiosError) {
    console.log(error.response?.data);
    if (error.response?.data) {
      const data = error.response.data;

      // Verifica si la data tiene la estructura esperada (ErrorResponse)
      if (this.isErrorResponse(data)) {
        const errorMessage = data.message || error.message;
        const errorStatus = data.status || HttpStatus.BAD_REQUEST;

        // Lanza el error con el mensaje y el código de estado correspondiente
        throw new HandleErrorUtil({
          type: errorStatus,
          message: errorMessage,
        });
      }
    }
    const name = error.message.split(' :: ')[0];
    if (name) {
      // Llama a HandleErrorUtil con el código de estado correspondiente
      throw new HandleErrorUtil({
        type: HttpStatus[name] || HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      });
    } else {
      throw new HandleErrorUtil({
        type: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      });
    }
  }
  private static isErrorResponse(data: any): data is ErrorResponse {
    return (
      typeof data === 'object' &&
      data !== null &&
      'message' in data &&
      'status' in data
    );
  }
}
