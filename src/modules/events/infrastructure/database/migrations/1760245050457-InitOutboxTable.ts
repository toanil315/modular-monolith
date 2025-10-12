import { MigrationInterface, QueryRunner } from "typeorm";

export class InitOutboxTable1760245050457 implements MigrationInterface {
    name = 'InitOutboxTable1760245050457'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "events"."outbox_messages" ("id" uuid NOT NULL, "type" character varying(255) NOT NULL, "content" jsonb NOT NULL, "processed_at" bigint, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_0171348f527c64b137e4d4f5b66" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "events"."ticket_types" ALTER COLUMN "event_id" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "events"."ticket_types" ALTER COLUMN "event_id" DROP NOT NULL`);
        await queryRunner.query(`DROP TABLE "events"."outbox_messages"`);
    }

}
