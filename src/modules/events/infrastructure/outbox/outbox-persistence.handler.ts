import { Provider } from '@nestjs/common';
import { OUTBOX_PERSISTENCE_HANDLER_TOKEN } from 'src/modules/common/application/messagings/outbox-persistence.handler';
import { OutboxPersistenceHandlerImpl } from 'src/modules/common/infrastructure/outbox/outbox-persistence.handler.impl';

export const OutboxPersistenceHandlerProvider: Provider = {
  provide: OUTBOX_PERSISTENCE_HANDLER_TOKEN,
  useClass: OutboxPersistenceHandlerImpl,
};
