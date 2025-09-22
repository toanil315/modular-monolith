import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryTypeOrmEntity } from './category.entity';
import { CategoryRepositoryProvider } from './category.repository.impl';
import { CategoriesController } from '../../presentation/categories/categories.controller';
import { CreateCategoryCommandHandler } from '../../application/categories/create-category/create-category.command-handler';
import { GetCategoryQueryHandler } from '../../application/categories/get-category/get-category.query-handler';
import { GetCategoriesQueryHandler } from '../../application/categories/get-categories/get-categories.query-handler';
import { ArchiveCategoryCommandHandler } from '../../application/categories/archive-category/archive-category.command-handler';
import { UpdateCategoryCommandHandler } from '../../application/categories/update-category/update-category.command-handler';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryTypeOrmEntity], 'default')],
  providers: [
    CategoryRepositoryProvider,

    GetCategoryQueryHandler,
    GetCategoriesQueryHandler,

    CreateCategoryCommandHandler,
    ArchiveCategoryCommandHandler,
    UpdateCategoryCommandHandler,
  ],
  controllers: [CategoriesController],
  exports: [CategoryRepositoryProvider],
})
export class CategoriesModule {}
