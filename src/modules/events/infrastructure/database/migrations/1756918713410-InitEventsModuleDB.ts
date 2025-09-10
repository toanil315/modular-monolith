import { MigrationInterface, QueryRunner } from "typeorm";

export class InitEventsModuleDB1756918713410 implements MigrationInterface {
    name = 'InitEventsModuleDB1756918713410'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "events"."events" ("id" uuid NOT NULL, "title" character varying(255) NOT NULL, "description" character varying(500) NOT NULL, "location" character varying(255) NOT NULL, "starts_at" integer NOT NULL, "ends_at" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_40731c7151fe4be3116e45ddf73" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "events"."events"`);
    }

}
