import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedRolesAndPermisisons1759653541767 implements MigrationInterface {
  name = 'SeedRolesAndPermisisons1759653541767';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // --- Seed Permissions ---
    const permissionsData = [
      'users:read',
      'users:update',
      'events:read',
      'events:search',
      'events:update',
      'ticket-types:read',
      'ticket-types:update',
      'categories:read',
      'categories:update',
      'carts:read',
      'carts:add',
      'carts:remove',
      'orders:read',
      'orders:create',
      'tickets:read',
      'tickets:check-in',
      'event-statistics:read',
    ];

    for (const code of permissionsData) {
      await queryRunner.query(
        `INSERT INTO "users"."permissions" (id)
           VALUES ($1)
           ON CONFLICT (id) DO NOTHING;`,
        [code],
      );
    }

    // --- Seed Roles ---
    const rolesData = ['Administrator', 'Member'];

    for (const name of rolesData) {
      await queryRunner.query(
        `INSERT INTO "users"."roles" (id)
           VALUES ($1)
           ON CONFLICT (id) DO NOTHING;`,
        [name],
      );
    }

    // --- Seed Roles_Permissions ---
    const memberPermissions = [
      'users:read',
      'users:update',
      'events:search',
      'ticket-types:read',
      'carts:read',
      'carts:add',
      'carts:remove',
      'orders:read',
      'orders:create',
      'tickets:read',
      'tickets:check-in',
    ];

    for (const permissionCode of memberPermissions) {
      await queryRunner.query(
        `INSERT INTO "users"."role_permissions" (role_id, permission_id)
           VALUES ($1, $2)
           ON CONFLICT DO NOTHING;`,
        ['Member', permissionCode],
      );
    }

    const adminPermissions = [
      'users:read',
      'users:update',
      'events:read',
      'events:search',
      'events:update',
      'ticket-types:read',
      'ticket-types:update',
      'categories:read',
      'categories:update',
      'carts:read',
      'carts:add',
      'carts:remove',
      'orders:read',
      'orders:create',
      'tickets:read',
      'tickets:check-in',
      'event-statistics:read',
    ];

    for (const permissionCode of adminPermissions) {
      await queryRunner.query(
        `INSERT INTO "users"."role_permissions"  (role_id, permission_id)
           VALUES ($1, $2)
           ON CONFLICT DO NOTHING;`,
        ['Administrator', permissionCode],
      );
    }

    console.log('✅ Seeded "users"."role_permissions" mapping');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM role_permissions`);
    await queryRunner.query(`DELETE FROM roles`);
    await queryRunner.query(`DELETE FROM permissions`);
  }
}
