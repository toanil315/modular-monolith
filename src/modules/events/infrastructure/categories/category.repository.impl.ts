import { Injectable, Provider } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { CategoryTypeOrmEntity } from './category.entity';
import { Category } from '../../domain/categories/category';
import { CategoryRepository } from '../../domain/categories/category.repository';
import { getDataSourceToken } from '@nestjs/typeorm';
import { EVENTS_CONNECTION_NAME } from '../database/datasource';

@Injectable()
export class CategoryRepositoryImpl implements CategoryRepository {
  private readonly ormRepo: Repository<CategoryTypeOrmEntity>;

  constructor(dataSource: DataSource) {
    this.ormRepo = dataSource.getRepository(CategoryTypeOrmEntity);
  }

  async insert(category: Category): Promise<void> {
    const newCategory = this.ormRepo.create({
      id: category.id,
      name: category.name,
      isArchived: category.isArchived,
    });

    await this.ormRepo.save(newCategory);
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
    await this.ormRepo.save({
      id: category.id,
      name: category.name,
      isArchived: category.isArchived,
    });
  }
}

export const CATEGORY_REPOSITORY_TOKEN = 'CATEGORY_REPOSITORY_TOKEN';

export const CategoryRepositoryProvider: Provider = {
  provide: CATEGORY_REPOSITORY_TOKEN,
  useFactory: (dataSource: DataSource): CategoryRepository =>
    new CategoryRepositoryImpl(dataSource),
  inject: [getDataSourceToken(EVENTS_CONNECTION_NAME)],
};
