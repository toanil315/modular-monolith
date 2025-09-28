import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { TICKETING_SCHEMA } from '../database/datasource';

@Entity({ schema: TICKETING_SCHEMA, name: 'ticket_inventories' })
export class TicketInventoryTypeOrmEntity {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column({ type: 'int', nullable: false })
  quantity: number;

  @Column({ type: 'int', nullable: false })
  availableQuantity: number;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;
}
