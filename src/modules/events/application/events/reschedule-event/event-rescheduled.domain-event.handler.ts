import { EventHandler } from 'src/modules/common/application/event-bus/event-handler.decorator';
import { EventDomainEvent } from 'src/modules/events/domain/events/event.domain-event';

export class EventRescheduledDomainEventHandler {
  @EventHandler(EventDomainEvent.EventRescheduledDomainEvent)
  handle(event: EventDomainEvent.EventRescheduledDomainEvent) {
    console.log(event);
  }
}
