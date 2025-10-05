import { Inject, Injectable, Provider } from '@nestjs/common';
import { UserTypeOrmEntity } from './user.entity';
import { User } from '../../domain/users/user';
import { UserRepository } from '../../domain/users/user.repository';
import { BaseRepository } from 'src/modules/common/infrastructure/database/base-repository.impl';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DOMAIN_EVENT_PUBLISHER_TOKEN,
  DomainEventPublisher,
} from 'src/modules/common/application/domain-event/domain-event.publisher';
import { Role } from '../../domain/users/role';

@Injectable()
export class UserRepositoryImpl
  extends BaseRepository<User, UserTypeOrmEntity>
  implements UserRepository
{
  constructor(
    @InjectRepository(UserTypeOrmEntity)
    ormRepo: Repository<UserTypeOrmEntity>,
    @Inject(DOMAIN_EVENT_PUBLISHER_TOKEN)
    domainEventPublisher: DomainEventPublisher,
  ) {
    super(ormRepo, domainEventPublisher);
  }

  async getById(userId: string): Promise<User | null> {
    const userEntity = await this.ormRepo.findOne({
      where: { id: userId },
      relations: ['roles'],
    });

    if (!userEntity) {
      return null;
    }

    return new User(
      userEntity.id,
      userEntity.firstName,
      userEntity.lastName,
      userEntity.email,
      userEntity.identityId,
      userEntity.roles.map((role) => new Role(role.id)),
    );
  }

  async save(user: User): Promise<void> {
    await this.persist(user, {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      identityId: user.identityId,
      roles: user.roles?.map((role) => ({
        id: role.name,
      })),
    });
  }
}

export const USER_REPOSITORY_TOKEN = 'USER_REPOSITORY_TOKEN';

export const UserRepositoryProvider: Provider = {
  provide: USER_REPOSITORY_TOKEN,
  useClass: UserRepositoryImpl,
};
