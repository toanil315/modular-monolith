import { Query } from '@nestjs/cqrs';
import { Result } from 'src/modules/common/domain/result';
import { Event } from 'src/modules/events/domain/events/event';

export interface SearchEventReturn {
  page: number;
  size: number;
  totalCount: number;
  records: Event[];
}

export class SearchEventsQuery extends Query<Result<SearchEventReturn>> {
  constructor(
    public readonly props: {
      categoryId?: string;
      startsAt?: number;
      endsAt?: number;
      page: number;
      size: number;
    },
  ) {
    super();
  }
}
