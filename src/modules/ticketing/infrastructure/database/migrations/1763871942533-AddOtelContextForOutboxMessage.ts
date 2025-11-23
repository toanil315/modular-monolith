import { MigrationInterface, QueryRunner } from "typeorm";

export class AddOtelContextForOutboxMessage1763871942533 implements MigrationInterface {
    name = 'AddOtelContextForOutboxMessage1763871942533'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ticketing"."outbox_messages" ADD "otel_context" jsonb`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ticketing"."outbox_messages" DROP COLUMN "otel_context"`);
    }

}
