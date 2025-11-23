import { Inject, Injectable, Provider } from '@nestjs/common';
import { UserTypeOrmEntity } from './user.entity';
import { User } from '../../domain/users/user';
import { UserRepository } from '../../domain/users/user.repository';
import { BaseRepository } from 'src/modules/common/infrastructure/database/base-repository.impl';
import { EntityManager } from 'typeorm';
import { InjectEntityManager } from '@nestjs/typeorm';

import { Role } from '../../domain/users/role';
import {
  OUTBOX_PERSISTENCE_HANDLER_TOKEN,
  OutboxPersistenceHandler,
} from 'src/modules/common/application/messagings/outbox-persistence.handler';

@Injectable()
export class UserRepositoryImpl extends BaseRepository implements UserRepository {
  constructor(
    @InjectEntityManager()
    private readonly manager: EntityManager,
    @Inject(OUTBOX_PERSISTENCE_HANDLER_TOKEN)
    private readonly outboxPersistenceHandler: OutboxPersistenceHandler,
  ) {
    super();
  }

  withManager(manager: EntityManager) {
    return new UserRepositoryImpl(manager, this.outboxPersistenceHandler) as this;
  }

  async getById(userId: string): Promise<User | null> {
    const userEntity = await this.manager.findOne(UserTypeOrmEntity, {
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
    await this.manager.transaction(async (transactionManager) => {
      await transactionManager.save(UserTypeOrmEntity, {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        identityId: user.identityId,
        roles: user.roles?.map((role) => ({
          id: role.name,
        })),
      });
      await this.outboxPersistenceHandler.save(user, transactionManager);
    });
  }
}

export const USER_REPOSITORY_TOKEN = 'USER_REPOSITORY_TOKEN';

export const UserRepositoryProvider: Provider = {
  provide: USER_REPOSITORY_TOKEN,
  useClass: UserRepositoryImpl,
};
