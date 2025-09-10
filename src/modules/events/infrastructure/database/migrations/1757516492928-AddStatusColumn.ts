import { MigrationInterface, QueryRunner } from "typeorm";

export class AddStatusColumn1757516492928 implements MigrationInterface {
    name = 'AddStatusColumn1757516492928'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "events"."events" ADD "status" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "events"."events" DROP COLUMN "status"`);
    }

}
