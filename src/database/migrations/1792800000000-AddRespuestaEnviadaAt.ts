import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRespuestaEnviadaAt1792800000000 implements MigrationInterface {
    name = 'AddRespuestaEnviadaAt1792800000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contactos" ADD "respuestaEnviadaAt" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contactos" DROP COLUMN "respuestaEnviadaAt"`);
    }

}
