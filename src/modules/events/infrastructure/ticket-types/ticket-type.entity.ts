import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { EVENTS_SCHEMA } from '../database/datasource';
import { EventTypeOrmEntity } from '../events/event.entity';

@Entity({ schema: EVENTS_SCHEMA, name: 'ticket_types' })
export class TicketTypeOrmEntity {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column({ type: 'uuid' })
  eventId: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: false })
  price: number;

  @Column({ type: 'varchar', length: 10, nullable: false })
  currency: string;

  @Column({ type: 'int', nullable: false })
  quantity: number;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;
}
