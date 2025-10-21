import { Inject } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { BaseEventHandler } from 'src/modules/common/application/event-bus/event-handler.base';
import { EventHandler } from 'src/modules/common/application/event-bus/event-handler.decorator';
import {
  OUTBOX_CONSUMER_REPOSITORY_TOKEN,
  OutboxConsumerRepository,
} from 'src/modules/common/application/messagings/outbox-consumer.repository';
import { OrderDomainEvent } from 'src/modules/ticketing/domain/orders/order.domain-event';
import { CreateTicketBatchCommand } from '../../tickets/create-ticket-batch/create-ticket-batch.command';

export class CreateTicketsDomainEventHandler extends BaseEventHandler {
  constructor(
    @Inject(OUTBOX_CONSUMER_REPOSITORY_TOKEN) outboxConsumerRepository: OutboxConsumerRepository,
    private readonly commandBus: CommandBus,
  ) {
    super(outboxConsumerRepository, 'ticketing.application.orders');
  }

  @EventHandler(OrderDomainEvent.OrderCreatedDomainEvent)
  async handle({ orderId }: OrderDomainEvent.OrderCreatedDomainEvent) {
    const result = await this.commandBus.execute(new CreateTicketBatchCommand({ orderId }));

    if (!result.isSuccess) {
      throw new Error(result.businessError?.message);
    }
  }
}
