import { UserEntity } from '../../modules/users/entities/user.entity';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

export default class UserSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const repository = dataSource.getRepository(UserEntity);

    // const data = {
    //   userName: 'admin',
    //   password: await hash('admin', 10),
    //   role: UserRole.ADMIN,
    //   isActivated: true,
    // };

    // const user = await repository.findOneBy({ userName: data.userName });

    // Insert only one record with this username.
    // if (!user) {
    //   await repository.insert([data]);
    // }

    // ---------------------------------------------------

    const userFactory = factoryManager.get(UserEntity);

    // Insert only one record.
    // await userFactory.save();

    // Insert many records in database.
    await userFactory.saveMany(40);
  }
}
