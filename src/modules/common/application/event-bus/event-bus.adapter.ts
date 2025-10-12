import { DomainEvent } from '../../domain/domain-event';
import { IntegrationEvent } from '../messagings/integration-event';

export const EVENT_BUS_ADAPTER_TOKEN = 'EVENT_BUS_ADAPTER_TOKEN';

export interface EventBusAdapter {
  publish: <TEvent extends DomainEvent | IntegrationEvent>(events: TEvent[]) => Promise<void>;
}
