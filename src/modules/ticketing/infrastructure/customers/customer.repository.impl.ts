import { Inject, Injectable, Provider } from '@nestjs/common';
import { Customer } from '../../domain/customers/customer';
import {
  CUSTOMER_REPOSITORY_TOKEN,
  CustomerRepository,
} from '../../domain/customers/customer.repository';
import { BaseRepository } from 'src/modules/common/infrastructure/database/base-repository.impl';
import { EntityManager } from 'typeorm';
import { InjectEntityManager } from '@nestjs/typeorm';
import { CustomerTypeOrmEntity } from './customer.entity';
import {
  OUTBOX_PERSISTENCE_HANDLER_TOKEN,
  OutboxPersistenceHandler,
} from 'src/modules/common/application/messagings/outbox-persistence.handler';

@Injectable()
export class CustomerRepositoryImpl extends BaseRepository implements CustomerRepository {
  constructor(
    @InjectEntityManager()
    private readonly manager: EntityManager,
    @Inject(OUTBOX_PERSISTENCE_HANDLER_TOKEN)
    private readonly outboxPersistenceHandler: OutboxPersistenceHandler,
  ) {
    super();
  }

  withManager(manager: EntityManager) {
    return new CustomerRepositoryImpl(manager, this.outboxPersistenceHandler) as this;
  }

  async getById(customerId: string): Promise<Customer | null> {
    const customerEntity = await this.manager.findOne(CustomerTypeOrmEntity, {
      where: { id: customerId },
    });

    if (!customerEntity) {
      return null;
    }

    return new Customer(
      customerEntity.id,
      customerEntity.firstName,
      customerEntity.lastName,
      customerEntity.email,
    );
  }

  async save(customer: Customer): Promise<void> {
    await this.manager.transaction(async (manager) => {
      await manager.save(CustomerTypeOrmEntity, {
        id: customer.id,
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
      });
      await this.outboxPersistenceHandler.save(customer, manager);
    });
  }
}

export const CustomerRepositoryProvider: Provider = {
  provide: CUSTOMER_REPOSITORY_TOKEN,
  useClass: CustomerRepositoryImpl,
};
