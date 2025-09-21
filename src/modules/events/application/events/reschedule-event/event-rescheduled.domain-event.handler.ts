import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { EventDomainEvent } from 'src/modules/events/domain/events/event.domain-event';

@EventsHandler(EventDomainEvent.EventRescheduledDomainEvent)
export class EventRescheduledDomainEventHandler
  implements IEventHandler<EventDomainEvent.EventRescheduledDomainEvent>
{
  handle(event: EventDomainEvent.EventRescheduledDomainEvent) {
    console.log(event);
  }
}
