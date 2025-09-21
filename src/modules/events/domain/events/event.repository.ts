import { Event } from './event';

export interface EventRepository {
  getById: (eventId: string) => Promise<Event | null>;
  save: (event: Event) => Promise<void>;
}
