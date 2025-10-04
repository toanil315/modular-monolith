import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIdentityIdColumnIntoUsersTable1759599739375 implements MigrationInterface {
    name = 'AddIdentityIdColumnIntoUsersTable1759599739375'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users"."users" ADD "identity_id" character varying(255)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users"."users" DROP COLUMN "identity_id"`);
    }

}
