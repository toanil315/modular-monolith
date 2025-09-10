import { Event } from './event';

export interface EventRepository {
  insert: (event: Event) => Promise<void>;
  getById: (eventId: string) => Promise<Event | null>;
}
