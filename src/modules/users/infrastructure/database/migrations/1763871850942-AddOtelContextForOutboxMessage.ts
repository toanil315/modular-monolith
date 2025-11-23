import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddOtelContextForOutboxMessage1763871850942 implements MigrationInterface {
  name = 'AddOtelContextForOutboxMessage1763871850942';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users"."outbox_messages" ADD "otel_context" jsonb`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users"."outbox_messages" DROP COLUMN "otel_context"`);
  }
}
