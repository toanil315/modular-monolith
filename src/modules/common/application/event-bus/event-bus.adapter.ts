import { DomainEvent } from '../../domain/domain-event';

export const EVENT_BUS_ADAPTER_TOKEN = 'EVENT_BUS_ADAPTER_TOKEN';

export interface EventBusAdapter {
  publish: <TEvent extends DomainEvent>(events: TEvent[]) => Promise<void>;
}
