import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitEventsDatabase1757786639162 implements MigrationInterface {
  name = 'InitEventsDatabase1757786639162';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "events"."categories" ("id" uuid NOT NULL, "name" character varying(255) NOT NULL, "is_archived" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "events"."events" ("id" uuid NOT NULL, "title" character varying(255) NOT NULL, "description" character varying(500) NOT NULL, "location" character varying(255) NOT NULL, "status" integer NOT NULL, "starts_at" integer NOT NULL, "ends_at" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "category_id" uuid, CONSTRAINT "PK_40731c7151fe4be3116e45ddf73" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "events"."ticket_types" ("id" uuid NOT NULL, "name" character varying(255) NOT NULL, "price" numeric(12,2) NOT NULL, "currency" character varying(10) NOT NULL, "quantity" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "event_id" uuid, CONSTRAINT "PK_5510ce7e18a4edc648c9fbfc283" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "events"."ticket_types"`);
    await queryRunner.query(`DROP TABLE "events"."events"`);
    await queryRunner.query(`DROP TABLE "events"."categories"`);
  }
}
