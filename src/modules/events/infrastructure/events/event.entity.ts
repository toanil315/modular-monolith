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
import { CategoryTypeOrmEntity } from '../categories/category.entity';

@Entity({ schema: EVENTS_SCHEMA, name: 'events' })
export class EventTypeOrmEntity {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @ManyToOne(() => CategoryTypeOrmEntity, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'category_id' })
  categoryId: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  title: string;

  @Column({ type: 'varchar', length: 500, nullable: false })
  description: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  location: string;

  @Column({ type: 'int' })
  status: number;

  @Column({ type: 'bigint' })
  startsAt: number;

  @Column({ type: 'bigint' })
  endsAt: number;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;
}
