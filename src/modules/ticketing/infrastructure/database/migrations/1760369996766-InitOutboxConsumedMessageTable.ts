import { MigrationInterface, QueryRunner } from "typeorm";

export class InitOutboxConsumedMessageTable1760369996766 implements MigrationInterface {
    name = 'InitOutboxConsumedMessageTable1760369996766'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "ticketing"."outbox_consumed_messages" ("id" uuid NOT NULL, "consumer" character varying(500) NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_ba4edd33b632d96c2eb9f704f9d" PRIMARY KEY ("id", "consumer"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "ticketing"."outbox_consumed_messages"`);
    }

}
