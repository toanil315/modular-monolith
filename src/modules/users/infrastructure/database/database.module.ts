import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import usersDataSource from './datasource';

@Module({
  imports: [TypeOrmModule.forRoot({ ...usersDataSource.options })],
})
export class UsersDatabaseModule {}
