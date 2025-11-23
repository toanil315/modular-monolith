import { Column, CreateDateColumn, PrimaryColumn, UpdateDateColumn } from 'typeorm';

export abstract class OutboxMessageTypeOrmEntity {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  type: string;

  @Column({ type: 'jsonb', nullable: false })
  content: string;

  @Column({ type: 'bigint', nullable: true })
  processedAt: number | null;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;

  @Column({ type: 'jsonb', nullable: true })
  otelContext: string;
}
