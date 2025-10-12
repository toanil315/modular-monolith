import { Inject, Injectable, Provider } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { CategoryTypeOrmEntity } from './category.entity';
import { Category } from '../../domain/categories/category';
import {
  CATEGORY_REPOSITORY_TOKEN,
  CategoryRepository,
} from '../../domain/categories/category.repository';
import { BaseRepository } from 'src/modules/common/infrastructure/database/base-repository.impl';
import { InjectEntityManager } from '@nestjs/typeorm';
import {
  OUTBOX_PERSISTENCE_HANDLER_TOKEN,
  OutboxPersistenceHandler,
} from 'src/modules/common/application/messagings/outbox-persistence.handler';

@Injectable()
export class CategoryRepositoryImpl extends BaseRepository implements CategoryRepository {
  constructor(
    @InjectEntityManager()
    manager: EntityManager,
    @Inject(OUTBOX_PERSISTENCE_HANDLER_TOKEN)
    outboxPersistenceHandler: OutboxPersistenceHandler,
  ) {
    super(manager, outboxPersistenceHandler);
  }

  async getById(categoryId: string): Promise<Category | null> {
    const categoryEntity = await this.manager.findOne(CategoryTypeOrmEntity, {
      where: { id: categoryId },
    });

    if (!categoryEntity) {
      return null;
    }

    return new Category(categoryEntity.id, categoryEntity.name, categoryEntity.isArchived);
  }

  async save(category: Category): Promise<void> {
    await this.manager.transaction(async (manager) => {
      await manager.save(CategoryTypeOrmEntity, {
        id: category.id,
        name: category.name,
        isArchived: category.isArchived,
      });
      await this.outboxPersistenceHandler.save(category, manager);
    });
  }
}

export const CategoryRepositoryProvider: Provider = {
  provide: CATEGORY_REPOSITORY_TOKEN,
  useClass: CategoryRepositoryImpl,
};
