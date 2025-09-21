import { Injectable, Provider } from '@nestjs/common';
import { UserTypeOrmEntity } from './user.entity';
import { User } from '../../domain/users/user';
import { UserRepository } from '../../domain/users/user.repository';
import { BaseRepository } from 'src/modules/common/infrastructure/database/base-repository.impl';
import { DataSource } from 'typeorm';
import { DomainEventPublisher } from 'src/modules/common/infrastructure/domain-event/domain-event.publisher';
import { getDataSourceToken } from '@nestjs/typeorm';
import { USERS_CONNECTION_NAME } from '../database/datasource';

@Injectable()
export class UserRepositoryImpl
  extends BaseRepository<User, UserTypeOrmEntity>
  implements UserRepository
{
  constructor(
    dataSource: DataSource,
    domainEventPublisher: DomainEventPublisher,
  ) {
    super(dataSource, UserTypeOrmEntity, domainEventPublisher);
  }

  async getById(userId: string): Promise<User | null> {
    const userEntity = await this.ormRepo.findOne({
      where: { id: userId },
    });

    if (!userEntity) {
      return null;
    }

    return new User(
      userEntity.id,
      userEntity.firstName,
      userEntity.lastName,
      userEntity.email,
    );
  }

  async save(user: User): Promise<void> {
    await this.persist(user, {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    });
  }
}

export const USER_REPOSITORY_TOKEN = 'USER_REPOSITORY_TOKEN';

export const UserRepositoryProvider: Provider = {
  provide: USER_REPOSITORY_TOKEN,
  useFactory: (
    dataSource: DataSource,
    domainEventPublisher: DomainEventPublisher,
  ): UserRepository => new UserRepositoryImpl(dataSource, domainEventPublisher),
  inject: [getDataSourceToken(USERS_CONNECTION_NAME), DomainEventPublisher],
};
