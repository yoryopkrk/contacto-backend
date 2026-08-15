import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1786808323655 implements MigrationInterface {
    name = 'Migration1786808323655'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "contactos" ("id" SERIAL NOT NULL, "nombre" character varying NOT NULL, "correo" character varying NOT NULL, "telefono" character varying, "comentario" text NOT NULL, "leido" integer NOT NULL DEFAULT '0', "id_tipo_notificacion" integer, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_d8a88d3690915aba8dc617a7ffd" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "contactos"`);
    }

}
