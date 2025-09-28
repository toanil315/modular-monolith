import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { TICKETING_SCHEMA } from '../database/datasource';
import { OrderStatus } from '../../domain/orders/order';

@Entity({ schema: TICKETING_SCHEMA, name: 'orders' })
export class OrderTypeOrmEntity {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column({ type: 'uuid', nullable: false })
  customerId: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  status: OrderStatus;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
    default: 0,
    transformer: {
      to: (value: number) => value,
      from: (value: string): number => parseFloat(value),
    },
  })
  totalPrice: number;

  @Column({ type: 'varchar', length: 10, nullable: true })
  currency: string | null;

  @Column({ type: 'boolean', default: false })
  ticketsIssued: boolean;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;
}
