import { UserEntity } from '../../modules/users/entities/user.entity';
import { setSeederFactory } from 'typeorm-extension';

export default setSeederFactory(UserEntity, async (faker) => {
  const user = new UserEntity();

  user.username = faker.internet.userName();
  user.email = faker.internet.email();
  // user.lastName = faker.name.lastName();
  // user.userName = faker.internet.userName(user.firstName, user.lastName);
  // user.email = faker.internet.email(user.firstName, user.lastName);
  // user.password = await hash(faker.internet.password(), 10);
  // user.phone = faker.phone.number();
  // user.avatar = faker.image.avatar();
  // user.role = faker.helpers.arrayElement([
  //   UserRole.ADMIN,
  //   UserRole.EDITOR,
  //   UserRole.GHOST,
  // ]);
  // user.isActivated = faker.datatype.boolean();

  return user;
});
