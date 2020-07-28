import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTablesAddUpdateMetaData1595954960843
  implements MigrationInterface {
  name = 'AlterTablesAddUpdateMetaData1595954960843';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_ff872d2b4e4bf59731b1930d5a"`);
    await queryRunner.query(`ALTER TABLE "funding" ADD "authorId" integer`);
    await queryRunner.query(
      `ALTER TABLE "funding" ADD "updateMetaDataUpdatedat" TIMESTAMP NOT NULL`
    );
    await queryRunner.query(`ALTER TABLE "enrollment" ADD "authorId" integer`);
    await queryRunner.query(
      `ALTER TABLE "enrollment" ADD "updateMetaDataUpdatedat" TIMESTAMP NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "income_determination" ADD "authorId" integer`
    );
    await queryRunner.query(
      `ALTER TABLE "income_determination" ADD "updateMetaDataUpdatedat" TIMESTAMP NOT NULL`
    );
    await queryRunner.query(`ALTER TABLE "family" ADD "authorId" integer`);
    await queryRunner.query(
      `ALTER TABLE "family" ADD "updateMetaDataUpdatedat" TIMESTAMP NOT NULL`
    );
    await queryRunner.query(`ALTER TABLE "child" ADD "authorId" integer`);
    await queryRunner.query(
      `ALTER TABLE "child" ADD "updateMetaDataUpdatedat" TIMESTAMP NOT NULL`
    );
    await queryRunner.query(`ALTER TABLE "report" ADD "authorId" integer`);
    await queryRunner.query(
      `ALTER TABLE "report" ADD "updateMetaDataUpdatedat" TIMESTAMP`
    );
    await queryRunner.query(
      `ALTER TABLE "funding" ADD CONSTRAINT "FK_817356665fbda51e379485c31dc" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "enrollment" ADD CONSTRAINT "FK_abc773907ba634123a2210c3146" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "income_determination" ADD CONSTRAINT "FK_e762fcf6981e58b6286ce3c59d2" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "family" ADD CONSTRAINT "FK_c21a67e17b469524e023afb69d2" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "child" ADD CONSTRAINT "FK_fef8675d11ae1b1a6a42304893c" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "report" ADD CONSTRAINT "FK_0a02cd5ccfc6544a17005a604fd" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "report" DROP CONSTRAINT "FK_0a02cd5ccfc6544a17005a604fd"`
    );
    await queryRunner.query(
      `ALTER TABLE "child" DROP CONSTRAINT "FK_fef8675d11ae1b1a6a42304893c"`
    );
    await queryRunner.query(
      `ALTER TABLE "family" DROP CONSTRAINT "FK_c21a67e17b469524e023afb69d2"`
    );
    await queryRunner.query(
      `ALTER TABLE "income_determination" DROP CONSTRAINT "FK_e762fcf6981e58b6286ce3c59d2"`
    );
    await queryRunner.query(
      `ALTER TABLE "enrollment" DROP CONSTRAINT "FK_abc773907ba634123a2210c3146"`
    );
    await queryRunner.query(
      `ALTER TABLE "funding" DROP CONSTRAINT "FK_817356665fbda51e379485c31dc"`
    );
    await queryRunner.query(
      `ALTER TABLE "report" DROP COLUMN "updateMetaDataUpdatedat"`
    );
    await queryRunner.query(`ALTER TABLE "report" DROP COLUMN "authorId"`);
    await queryRunner.query(
      `ALTER TABLE "child" DROP COLUMN "updateMetaDataUpdatedat"`
    );
    await queryRunner.query(`ALTER TABLE "child" DROP COLUMN "authorId"`);
    await queryRunner.query(
      `ALTER TABLE "family" DROP COLUMN "updateMetaDataUpdatedat"`
    );
    await queryRunner.query(`ALTER TABLE "family" DROP COLUMN "authorId"`);
    await queryRunner.query(
      `ALTER TABLE "income_determination" DROP COLUMN "updateMetaDataUpdatedat"`
    );
    await queryRunner.query(
      `ALTER TABLE "income_determination" DROP COLUMN "authorId"`
    );
    await queryRunner.query(
      `ALTER TABLE "enrollment" DROP COLUMN "updateMetaDataUpdatedat"`
    );
    await queryRunner.query(`ALTER TABLE "enrollment" DROP COLUMN "authorId"`);
    await queryRunner.query(
      `ALTER TABLE "funding" DROP COLUMN "updateMetaDataUpdatedat"`
    );
    await queryRunner.query(`ALTER TABLE "funding" DROP COLUMN "authorId"`);
    await queryRunner.query(
      `CREATE INDEX "IDX_ff872d2b4e4bf59731b1930d5a" ON "report" ("type") `
    );
  }
}
