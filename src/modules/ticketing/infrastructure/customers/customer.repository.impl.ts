import { Inject, Injectable, Provider } from '@nestjs/common';
import { Customer } from '../../domain/customers/customer';
import {
  CUSTOMER_REPOSITORY_TOKEN,
  CustomerRepository,
} from '../../domain/customers/customer.repository';
import { BaseRepository } from 'src/modules/common/infrastructure/database/base-repository.impl';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomerTypeOrmEntity } from './customer.entity';
import {
  DOMAIN_EVENT_PUBLISHER_TOKEN,
  DomainEventPublisher,
} from 'src/modules/common/application/domain-event/domain-event.publisher';

@Injectable()
export class CustomerRepositoryImpl
  extends BaseRepository<Customer, CustomerTypeOrmEntity>
  implements CustomerRepository
{
  constructor(
    @InjectRepository(CustomerTypeOrmEntity)
    ormRepo: Repository<CustomerTypeOrmEntity>,
    @Inject(DOMAIN_EVENT_PUBLISHER_TOKEN)
    domainEventPublisher: DomainEventPublisher,
  ) {
    super(ormRepo, domainEventPublisher);
  }

  async getById(customerId: string): Promise<Customer | null> {
    const customerEntity = await this.ormRepo.findOne({
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
    await this.persist(customer, {
      id: customer.id,
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: customer.email,
    });
  }
}

export const CustomerRepositoryProvider: Provider = {
  provide: CUSTOMER_REPOSITORY_TOKEN,
  useClass: CustomerRepositoryImpl,
};
