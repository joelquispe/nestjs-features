import { Factory } from 'nestjs-seeder';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  userId: number;

  @Factory((faker) => faker.person.fullName())
  @Column()
  username: string;

  @Factory((faker) => faker.internet.email)
  @Column()
  email: string;
}
