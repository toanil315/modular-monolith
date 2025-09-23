import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerTypeOrmEntity } from './customer.entity';
import { CustomerRepositoryProvider } from './customer.repository.impl';
import { CreateCustomerCommandHandler } from '../../application/customers/create-customer/create-customer.command-handler';

@Module({
  imports: [TypeOrmModule.forFeature([CustomerTypeOrmEntity])],
  providers: [CustomerRepositoryProvider, CreateCustomerCommandHandler],
})
export class CustomersModule {}
