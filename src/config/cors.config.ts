import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

const corsConfig: CorsOptions = {
  origin: 'http://localhost:4200', // Reemplaza con la URL de tu aplicación de Angular
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

export default corsConfig;
