import { runSeeder, Seeder, SeederFactoryManager } from 'typeorm-extension';
import UserSeeder from './user.seeder';
import { DataSource } from 'typeorm';

export class MainSeeder implements Seeder {
  async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    await runSeeder(dataSource, UserSeeder);
  }
}
