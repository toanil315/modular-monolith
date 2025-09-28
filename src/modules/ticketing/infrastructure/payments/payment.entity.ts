import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { TICKETING_SCHEMA } from '../database/datasource';

@Entity({ schema: TICKETING_SCHEMA, name: 'payments' })
export class PaymentTypeOrmEntity {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column({ type: 'uuid', nullable: false })
  orderId: string;

  @Column({ type: 'uuid', nullable: false })
  transactionId: string;

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
  amount: number;

  @Column({ type: 'varchar', length: 10, nullable: false })
  currency: string;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
    nullable: true,
    transformer: {
      to: (value: number | null) => value,
      from: (value: string | null): number | null => (value !== null ? parseFloat(value) : null),
    },
  })
  amountRefunded: number | null;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;

  @Column({ type: 'timestamp with time zone', nullable: true })
  refundedAt: Date | null;
}
