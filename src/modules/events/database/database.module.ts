import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import eventsDataSource from './datasource';

@Module({
  imports: [TypeOrmModule.forRoot({ ...eventsDataSource.options })],
})
export class EventsDatabaseModule {}
