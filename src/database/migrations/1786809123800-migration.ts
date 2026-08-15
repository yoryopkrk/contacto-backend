import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1786809123800 implements MigrationInterface {
    name = 'Migration1786809123800'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contactos" ADD "origen" character varying NOT NULL DEFAULT 'portafolio'`);
        await queryRunner.query(`ALTER TABLE "contactos" ALTER COLUMN "origen" DROP DEFAULT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contactos" DROP COLUMN "origen"`);
    }

}
