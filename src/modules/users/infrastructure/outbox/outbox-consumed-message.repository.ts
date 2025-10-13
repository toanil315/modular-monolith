import { Provider } from '@nestjs/common';
import { OUTBOX_CONSUMER_REPOSITORY_TOKEN } from 'src/modules/common/application/messagings/outbox-consumer.repository';
import { OutboxConsumerRepositoryImpl } from 'src/modules/common/infrastructure/outbox/outbox-consumer.repository.impl';

export const OutboxConsumerRepositoryProvider: Provider = {
  provide: OUTBOX_CONSUMER_REPOSITORY_TOKEN,
  useClass: OutboxConsumerRepositoryImpl,
};
