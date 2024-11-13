import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Seeder, DataFactory } from 'nestjs-seeder';
import { QueryBuilder, Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class UsersSeeder implements Seeder {
  constructor(
    @InjectRepository(UserEntity)
    private readonly users: Repository<UserEntity>,
    private readonly queryBuilder: QueryBuilder<UserEntity>,
  ) {}

  async seed(): Promise<any> {
    // Generate 10 users.
    const users = DataFactory.createForClass(UserEntity).generate(10);

    // Insert into the database.
    return this.queryBuilder.insert().into(UserEntity).values(users).execute();
  }

  async drop(): Promise<any> {
    return this.queryBuilder.delete().from(UserEntity).execute();
  }
}
