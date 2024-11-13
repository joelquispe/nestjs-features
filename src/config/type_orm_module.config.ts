import { ConfigModule, ConfigService, ConfigType } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import environments from 'src/enviroments';
import configuration from './configuration';
import { join } from 'path';
import { MongooseModule } from '@nestjs/mongoose';
import { DataSource } from 'typeorm';
import { UserEntity } from 'src/modules/users/entities/user.entity';

export const configModuleConfig = ConfigModule.forRoot({
  envFilePath: environments[process.env.NODE_ENV] || '.env.dev',
  load: [configuration],
  isGlobal: true,
});

export const typeOrmModuleConfig = TypeOrmModule.forRootAsync({
  imports: [configModuleConfig],

  inject: [configuration.KEY],
  useFactory: (configService: ConfigType<typeof configuration>) => {
    console.log(configService.google);
    const { port, user, password, rootPassword, name, host } =
      configService.database;

    const entitiesPath = join(__dirname, '**', '*.entity{.ts,.js}');
    console.log('connect to: ' + host);
    return {
      type: 'mysql',
      host: host,
      port: port,
      database: name,
      username: user,
      password: password,
      entities: [UserEntity],
      synchronize: false,
      migrationsTableName: 'migrations',
      migrations: [__dirname + '/../migrations/**/*.ts'],
    };
  },
});

export const mongooseModuleConfig = MongooseModule.forRootAsync({
  imports: [configModuleConfig],
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => {
    console.log(configService.get('database.mongo_uri'));
    return {
      autoCreate: true,
      dbName: 'nestjsfeatures',
      uri: configService.get('database.mongo_uri'),
    };
  },
});
