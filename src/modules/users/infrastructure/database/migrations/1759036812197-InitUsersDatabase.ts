import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitUsersDatabase1759036812197 implements MigrationInterface {
  name = 'InitUsersDatabase1759036812197';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users"."users" ("id" uuid NOT NULL, "first_name" character varying(255) NOT NULL, "last_name" character varying(255) NOT NULL, "email" character varying(255) NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "users"."users"`);
  }
}
