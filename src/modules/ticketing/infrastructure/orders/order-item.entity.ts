import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { TICKETING_SCHEMA } from '../database/datasource';

@Entity({ schema: TICKETING_SCHEMA, name: 'order_items' })
export class OrderItemTypeOrmEntity {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column({ type: 'uuid', nullable: false })
  orderId: string;

  @Column({ type: 'uuid', nullable: false })
  ticketTypeId: string;

  @Column({ type: 'int', nullable: false })
  quantity: number;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
    nullable: false,
    transformer: {
      to: (value: number) => value,
      from: (value: string): number => parseFloat(value),
    },
  })
  unitPrice: number;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
    nullable: false,
    transformer: {
      to: (value: number) => value,
      from: (value: string): number => parseFloat(value),
    },
  })
  price: number;

  @Column({ type: 'varchar', length: 10, nullable: false })
  currency: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;
}
