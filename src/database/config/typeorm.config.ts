import { config } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import { createDatabase, runSeeders, SeederOptions } from 'typeorm-extension';
import { MainSeeder } from '../seeds/main.seeder';

config();
export const options: DataSourceOptions & SeederOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  database: 'test',
  username: 'root',
  password: '',
  migrationsTableName: 'migrations',
  entities: ['dist/**/*.entity.js'],
  factories: ['dist/**/database/factories/**/*.js'],
  seeds: ['dist/**/database/seeds/**/*.js'],

  synchronize: true,
};
export const dataSource = new DataSource(
  options as DataSourceOptions & SeederOptions,
);

// (async () => {
//   const options: DataSourceOptions & SeederOptions = {
//     type: 'mysql',
//     host: 'localhost',
//     port: 3306,
//     database: 'test',
//     username: 'root',
//     password: '',
//     migrationsTableName: 'migrations',
//     entities: ['./*.entity.ts'],
//     migrations: [__dirname + '/../database/migrations/**/*.ts'],
//     factories: ['./*.factory.ts'],
//     synchronize: false,
//     seeds: ['./*.seeder.ts'],
//   };

//   const dataSource = new DataSource(options);
//   await dataSource.initialize();

//   await runSeeders(dataSource, {
//     seeds: ['./*.seeder.ts'],
//     factories: ['./*.factory.ts'],
//   });
// })();
