import { Provider } from '@nestjs/common';
import { INBOX_CONSUMER_REPOSITORY_TOKEN } from 'src/modules/common/application/messagings/inbox-consumer.repository';
import { InboxConsumerRepositoryImpl } from 'src/modules/common/infrastructure/inbox/inbox-consumer.repository.impl';

export const InboxConsumerRepositoryProvider: Provider = {
  provide: INBOX_CONSUMER_REPOSITORY_TOKEN,
  useClass: InboxConsumerRepositoryImpl,
};
