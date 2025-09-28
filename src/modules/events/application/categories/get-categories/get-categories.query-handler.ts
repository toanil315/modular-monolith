import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCategoriesQuery } from './get-categories.query';
import { DataSource } from 'typeorm';
import { Category } from 'src/modules/events/domain/categories/category';
import { Result } from 'src/modules/common/domain/result';

@QueryHandler(GetCategoriesQuery)
export class GetCategoriesQueryHandler implements IQueryHandler<GetCategoriesQuery> {
  constructor(private readonly dataSource: DataSource) {}

  async execute() {
    const rawEntities = await this.dataSource.query<
      { id: string; name: string; isArchived: boolean }[]
    >(`
        SELECT
            id,
            name,
            is_archived AS "isArchived"
        FROM events.categories
    `);

    return Result.success(
      rawEntities.map((record) => new Category(record.id, record.name, record.isArchived)),
    );
  }
}
