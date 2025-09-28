import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { TICKETING_SCHEMA } from '../database/datasource';

@Entity({ schema: TICKETING_SCHEMA, name: 'tickets' })
export class TicketTypeOrmEntity {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column({ type: 'uuid', nullable: false })
  customerId: string;

  @Column({ type: 'uuid', nullable: false })
  orderId: string;

  @Column({ type: 'uuid', nullable: false })
  eventId: string;

  @Column({ type: 'uuid', nullable: false })
  ticketTypeId: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  code: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;

  @Column({ type: 'boolean', default: false })
  archived: boolean;
}
