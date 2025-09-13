import { Query } from '@nestjs/cqrs';
import { Event } from 'src/modules/events/domain/events/event';

export interface SearchEventReturn {
  page: number;
  size: number;
  totalCount: number;
  records: Event[];
}

export class SearchEventsQuery extends Query<SearchEventReturn> {
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
