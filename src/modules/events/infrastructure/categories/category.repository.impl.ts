import { Injectable, Provider } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CategoryTypeOrmEntity } from './category.entity';
import { Category } from '../../domain/categories/category';
import { CategoryRepository } from '../../domain/categories/category.repository';
import { DomainEventPublisher } from 'src/modules/common/infrastructure/domain-event/domain-event.publisher';
import { BaseRepository } from 'src/modules/common/infrastructure/database/base-repository.impl';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CategoryRepositoryImpl
  extends BaseRepository<Category, CategoryTypeOrmEntity>
  implements CategoryRepository
{
  constructor(
    @InjectRepository(CategoryTypeOrmEntity)
    ormRepo: Repository<CategoryTypeOrmEntity>,
    domainEventPublisher: DomainEventPublisher,
  ) {
    super(ormRepo, domainEventPublisher);
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
  useClass: CategoryRepositoryImpl,
};
