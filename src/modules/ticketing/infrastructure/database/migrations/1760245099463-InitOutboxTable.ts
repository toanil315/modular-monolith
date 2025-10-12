import { MigrationInterface, QueryRunner } from "typeorm";

export class InitOutboxTable1760245099463 implements MigrationInterface {
    name = 'InitOutboxTable1760245099463'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "ticketing"."outbox_messages" ("id" uuid NOT NULL, "type" character varying(255) NOT NULL, "content" jsonb NOT NULL, "processed_at" bigint, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_0171348f527c64b137e4d4f5b66" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "ticketing"."outbox_messages"`);
    }

}
