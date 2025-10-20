import { Inject, Injectable, Provider } from '@nestjs/common';
import { ORDER_REPOSITORY_TOKEN, OrderRepository } from '../../domain/orders/order.repository';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { Order } from '../../domain/orders/order';
import { OrderTypeOrmEntity } from './order.entity';
import { OrderItemTypeOrmEntity } from './order-item.entity';
import { BaseRepository } from 'src/modules/common/infrastructure/database/base-repository.impl';
import {
  OUTBOX_PERSISTENCE_HANDLER_TOKEN,
  OutboxPersistenceHandler,
} from 'src/modules/common/application/messagings/outbox-persistence.handler';

@Injectable()
export class OrderRepositoryImpl extends BaseRepository implements OrderRepository {
  constructor(
    @InjectEntityManager()
    private readonly manager: EntityManager,
    @Inject(OUTBOX_PERSISTENCE_HANDLER_TOKEN)
    private readonly outboxPersistenceHandler: OutboxPersistenceHandler,
  ) {
    super();
  }

  withManager(manager: EntityManager) {
    return new OrderRepositoryImpl(manager, this.outboxPersistenceHandler) as this;
  }

  async getById(orderId: string) {
    const query = `
        SELECT 
            o.id,
            o.customer_id as "customerId",
            o.status,
            o.total_price::float as "totalPrice",
            o.currency,
            o.tickets_issued as "ticketIssued",
            o.created_at as "createdAt",
            COALESCE(
                json_agg(
                        json_build_object(
                            'id', oi.id,
                            'ticketTypeId', oi.ticket_type_id,
                            'quantity', oi.quantity,
                            'unitPrice', oi.unit_price::float,
                            'price', oi.price::float,            
                            'currency', oi.currency,
                            'createdAt', oi.created_at,
                            'updatedAt', oi.updated_at
                    )
                ) FILTER (WHERE oi.id IS NOT NULL),
                '[]'
            ) AS "orderItems"
        FROM ticketing.orders o
        LEFT JOIN ticketing.order_items oi
        ON oi.order_id = o.id
        WHERE o.id = $1
        GROUP BY o.id;     
    `;

    const rows = await this.manager.query<Order[]>(query, [orderId]);

    if (!rows.length) return null;

    return rows[0];
  }

  async save(order: Order) {
    await this.manager.transaction(async (manager) => {
      await manager.save(OrderTypeOrmEntity, {
        id: order.id,
        customerId: order.customerId,
        createdAt: order.createdAt,
        currency: order.currency,
        status: order.status,
        ticketsIssued: order.ticketsIssued,
        totalPrice: order.totalPrice,
      });

      await manager.save(
        OrderItemTypeOrmEntity,
        order.orderItems.map<Partial<OrderItemTypeOrmEntity>>((orderItem) => ({
          id: orderItem.id,
          orderId: orderItem.orderId,
          ticketTypeId: orderItem.ticketTypeId,
          currency: orderItem.currency,
          price: orderItem.price,
          unitPrice: orderItem.unitPrice,
          quantity: orderItem.quantity,
        })),
      );

      await this.outboxPersistenceHandler.save(order, manager);
    });
  }
}

export const OrderRepositoryProvider: Provider = {
  provide: ORDER_REPOSITORY_TOKEN,
  useClass: OrderRepositoryImpl,
};
