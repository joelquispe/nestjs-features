import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WebsocketsModule } from './modules/websockets/websockets.module';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import environments from './enviroments';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './modules/auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './modules/auth/guards/roles.guard';
import { UsersModule } from './modules/users/users.module';
import {
  mongooseModuleConfig,
  typeOrmModuleConfig,
} from './config/type_orm_module.config';

import { TasksModule } from './modules/mongo/tasks/tasks.module';
import { GraphQLModule } from '@nestjs/graphql';
import {
  ApolloDriver,
  ApolloDriverConfig,
  ApolloFederationDriver,
  ApolloFederationDriverConfig,
} from '@nestjs/apollo';
import { join } from 'path';
import { FooResolver } from './core/resolver';
import { ProductsModule } from './modules/mongo/products/products.module';
import { CategoriesModule } from './modules/mongo/categories/categories.module';
import { AuthenticationsModule } from './modules/authentications/authentications.module';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { UsersSeeder } from './modules/users/seeders/users.seeder';
import { TwilioModule } from 'nestjs-twilio';
import { YapeModule } from './modules/yape/yape.module';
import { TwilioClientModule } from './modules/twilio-client/twilio-client.module';
import { PaymentCardModule } from './modules/payment-card/payment-card.module';

@Module({
  imports: [
    // GraphQLModule.forRoot<ApolloDriverConfig>({
    //   driver: ApolloDriver,
    //   typePaths: ['**/*.graphql'],
    //   playground: true,
    //   definitions: {
    //     path: join(process.cwd(), 'src/query.graphql'),
    //   },
    // }),
    // GraphQLModule.forRoot({
    //   driver: ApolloDriver,
    //   allowBatchedHttpRequests: true,
    //   playground: false,

    //   typePaths: ['./**/*.gql'],
    //   autoSchemaFile: join(process.cwd(), 'src/query.gql'),
    //   installSubscriptionHandlers: true,

    //   cors: {
    //     origin: 'http://localhost:3000',
    //     credentials: true,
    //   },
    //   context: ({ req }) => {
    //     return { req };
    //   },
    // }),
    WebsocketsModule,
    ConfigModule.forRoot({
      envFilePath: environments[process.env.NODE_ENV] || '.env.dev',
      load: [configuration],
      isGlobal: true,
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
    YapeModule,
    TwilioClientModule,

    // ProductsModule,
    // CategoriesModule,
    // AuthenticationsModule,
    // typeOrmModuleConfig,
    // mongooseModuleConfig,
    AuthModule,

    PaymentCardModule,
    // UsersModule,
    // TasksModule,
  ],
  controllers: [AppController],
  providers: [
    FooResolver,
    AppService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
