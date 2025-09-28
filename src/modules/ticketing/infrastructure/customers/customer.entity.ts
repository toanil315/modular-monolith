import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { TICKETING_SCHEMA } from '../database/datasource';

@Entity({ schema: TICKETING_SCHEMA, name: 'customers' })
export class CustomerTypeOrmEntity {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  firstName: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  lastName: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  email: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;
}
