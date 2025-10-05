import { Entity, ManyToMany, CreateDateColumn, UpdateDateColumn, PrimaryColumn } from 'typeorm';
import { USERS_SCHEMA } from '../database/datasource';
import { RoleTypeOrmEntity } from './role.entity';

@Entity({ schema: USERS_SCHEMA, name: 'permissions' })
export class PermissionTypeOrmEntity {
  @PrimaryColumn({ type: 'varchar', length: 255 })
  id: string;

  @ManyToMany(() => RoleTypeOrmEntity, (role) => role.permissions)
  roles: RoleTypeOrmEntity[];

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;
}
