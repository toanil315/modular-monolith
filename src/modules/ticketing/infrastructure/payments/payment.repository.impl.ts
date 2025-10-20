import { Inject, Injectable, Provider } from '@nestjs/common';
import { BaseRepository } from 'src/modules/common/infrastructure/database/base-repository.impl';
import { Payment } from '../../domain/payments/payment';
import { PaymentTypeOrmEntity } from './payment.entity';
import {
  PAYMENT_REPOSITORY_TOKEN,
  PaymentRepository,
} from '../../domain/payments/payment.repository';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import {
  OUTBOX_PERSISTENCE_HANDLER_TOKEN,
  OutboxPersistenceHandler,
} from 'src/modules/common/application/messagings/outbox-persistence.handler';

@Injectable()
export class PaymentRepositoryImpl extends BaseRepository implements PaymentRepository {
  constructor(
    @InjectEntityManager()
    private readonly manager: EntityManager,
    @Inject(OUTBOX_PERSISTENCE_HANDLER_TOKEN)
    private readonly outboxPersistenceHandler: OutboxPersistenceHandler,
  ) {
    super();
  }

  withManager(manager: EntityManager) {
    return new PaymentRepositoryImpl(manager, this.outboxPersistenceHandler) as this;
  }

  async getById(paymentId: string): Promise<Payment | null> {
    const paymentEntity = await this.manager.findOne(PaymentTypeOrmEntity, {
      where: { id: paymentId },
    });

    if (!paymentEntity) {
      return null;
    }

    return new Payment(
      paymentEntity.id,
      paymentEntity.orderId,
      paymentEntity.transactionId,
      paymentEntity.amount,
      paymentEntity.currency,
      paymentEntity.amountRefunded,
      paymentEntity.createdAt,
      paymentEntity.refundedAt,
    );
  }

  async getForEvent(eventId: string): Promise<Payment[]> {
    const rows = await this.manager
      .createQueryBuilder(PaymentTypeOrmEntity, 'p')
      .innerJoin('orders', 'o', 'o.id = p.orderId')
      .where('o.eventId = :eventId', { eventId })
      .getMany();

    return rows.map(
      (e) =>
        new Payment(
          e.id,
          e.orderId,
          e.transactionId,
          e.amount,
          e.currency,
          e.amountRefunded,
          e.createdAt,
          e.refundedAt,
        ),
    );
  }

  async save(payment: Payment): Promise<void> {
    await this.manager.transaction(async (manager) => {
      await this.manager.save(PaymentTypeOrmEntity, {
        id: payment.id,
        amount: payment.amount,
        amountRefunded: payment.amountRefunded,
        createdAt: payment.createdAt,
        currency: payment.currency,
        orderId: payment.orderId,
        refundedAt: payment.refundedAt,
        transactionId: payment.transactionId,
      });
      await this.outboxPersistenceHandler.save(payment, manager);
    });
  }
}

export const PaymentRepositoryProvider: Provider = {
  provide: PAYMENT_REPOSITORY_TOKEN,
  useClass: PaymentRepositoryImpl,
};
