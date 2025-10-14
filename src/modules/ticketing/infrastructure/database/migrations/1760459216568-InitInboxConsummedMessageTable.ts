import { MigrationInterface, QueryRunner } from "typeorm";

export class InitInboxConsummedMessageTable1760459216568 implements MigrationInterface {
    name = 'InitInboxConsummedMessageTable1760459216568'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "ticketing"."inbox_consumed_messages" ("id" uuid NOT NULL, "consumer" character varying(500) NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_91e91e63c0dcf2cb67f66c70d6b" PRIMARY KEY ("id", "consumer"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "ticketing"."inbox_consumed_messages"`);
    }

}
