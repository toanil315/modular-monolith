import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitTicketingDatabase1759037888325 implements MigrationInterface {
  name = 'InitTicketingDatabase1759037888325';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "ticketing"."tickets" ("id" uuid NOT NULL, "customer_id" uuid NOT NULL, "order_id" uuid NOT NULL, "event_id" uuid NOT NULL, "ticket_type_id" uuid NOT NULL, "code" character varying(255) NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "archived" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_343bc942ae261cf7a1377f48fd0" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "ticketing"."ticket_inventories" ("id" uuid NOT NULL, "quantity" integer NOT NULL, "available_quantity" integer NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_7a11edf89335b92b912ba826f4b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "ticketing"."payments" ("id" uuid NOT NULL, "order_id" uuid NOT NULL, "transaction_id" uuid NOT NULL, "amount" numeric(12,2) NOT NULL, "currency" character varying(10) NOT NULL, "amount_refunded" numeric(12,2), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "refunded_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_197ab7af18c93fbb0c9b28b4a59" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "ticketing"."orders" ("id" uuid NOT NULL, "customer_id" uuid NOT NULL, "status" character varying(50) NOT NULL, "total_price" numeric(12,2) NOT NULL DEFAULT '0', "currency" character varying(10), "tickets_issued" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "ticketing"."order_items" ("id" uuid NOT NULL, "order_id" uuid NOT NULL, "ticket_type_id" uuid NOT NULL, "quantity" integer NOT NULL, "unit_price" numeric(12,2) NOT NULL, "price" numeric(12,2) NOT NULL, "currency" character varying(10) NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_005269d8574e6fac0493715c308" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "ticketing"."customers" ("id" uuid NOT NULL, "first_name" character varying(255) NOT NULL, "last_name" character varying(255) NOT NULL, "email" character varying(255) NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_133ec679a801fab5e070f73d3ea" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "ticketing"."customers"`);
    await queryRunner.query(`DROP TABLE "ticketing"."order_items"`);
    await queryRunner.query(`DROP TABLE "ticketing"."orders"`);
    await queryRunner.query(`DROP TABLE "ticketing"."payments"`);
    await queryRunner.query(`DROP TABLE "ticketing"."ticket_inventories"`);
    await queryRunner.query(`DROP TABLE "ticketing"."tickets"`);
  }
}
