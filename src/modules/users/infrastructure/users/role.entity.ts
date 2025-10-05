import {
  Entity,
  ManyToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinTable,
  PrimaryColumn,
} from 'typeorm';
import { USERS_SCHEMA } from '../database/datasource';
import { UserTypeOrmEntity } from './user.entity';
import { PermissionTypeOrmEntity } from './permisison.entity';

@Entity({ schema: USERS_SCHEMA, name: 'roles' })
export class RoleTypeOrmEntity {
  @PrimaryColumn({ type: 'varchar', length: 255 })
  id: string;

  @ManyToMany(() => UserTypeOrmEntity, (user) => user.roles)
  users: UserTypeOrmEntity[];

  @ManyToMany(() => PermissionTypeOrmEntity, (permission) => permission.roles)
  @JoinTable({
    name: 'role_permissions',
    joinColumn: { name: 'role_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'permission_id', referencedColumnName: 'id' },
  })
  permissions: PermissionTypeOrmEntity[];

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;
}
