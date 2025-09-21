import { Injectable, Provider } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { CategoryTypeOrmEntity } from './category.entity';
import { Category } from '../../domain/categories/category';
import { CategoryRepository } from '../../domain/categories/category.repository';
import { getDataSourceToken } from '@nestjs/typeorm';
import { EVENTS_CONNECTION_NAME } from '../database/datasource';
import { DomainEventPublisher } from 'src/modules/common/infrastructure/domain-event/domain-event.publisher';
import { BaseRepository } from 'src/modules/common/infrastructure/database/base-repository.impl';

@Injectable()
export class CategoryRepositoryImpl
  extends BaseRepository<Category, CategoryTypeOrmEntity>
  implements CategoryRepository
{
  constructor(
    dataSource: DataSource,
    domainEventPublisher: DomainEventPublisher,
  ) {
    super(dataSource, CategoryTypeOrmEntity, domainEventPublisher);
  }

  async getById(categoryId: string): Promise<Category | null> {
    const categoryEntity = await this.ormRepo.findOne({
      where: { id: categoryId },
    });

    if (!categoryEntity) {
      return null;
    }

    return new Category(
      categoryEntity.id,
      categoryEntity.name,
      categoryEntity.isArchived,
    );
  }

  async save(category: Category): Promise<void> {
    await this.persist(category, {
      id: category.id,
      name: category.name,
      isArchived: category.isArchived,
    });
  }
}

export const CATEGORY_REPOSITORY_TOKEN = 'CATEGORY_REPOSITORY_TOKEN';

export const CategoryRepositoryProvider: Provider = {
  provide: CATEGORY_REPOSITORY_TOKEN,
  useFactory: (
    dataSource: DataSource,
    domainEventPublisher: DomainEventPublisher,
  ): CategoryRepository =>
    new CategoryRepositoryImpl(dataSource, domainEventPublisher),
  inject: [getDataSourceToken(EVENTS_CONNECTION_NAME), DomainEventPublisher],
};
