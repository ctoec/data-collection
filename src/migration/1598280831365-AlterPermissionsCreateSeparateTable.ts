import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterPermissionsCreateSeparateTable1598280831365
  implements MigrationInterface {
  name = 'AlterPermissionsCreateSeparateTable1598280831365';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "organization_permission" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "organizationId" integer, CONSTRAINT "PK_ff6561c44fcca6c8e16fe459157" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "site_permission" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "siteId" integer, CONSTRAINT "PK_f6582185e1ced5a6aafc3143f51" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "community_permission" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "communityId" integer, CONSTRAINT "PK_df854e201c33903ab4887129351" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "organization_permission" ADD CONSTRAINT "FK_b1ffd0e0c9731e4dc1745214f26" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "organization_permission" ADD CONSTRAINT "FK_005aa04b3eb93b59b673ef77878" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "site_permission" ADD CONSTRAINT "FK_5ede40be71b1ee2adc0a929bebe" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "site_permission" ADD CONSTRAINT "FK_a5b57b05f00c5701b782ea2e93f" FOREIGN KEY ("siteId") REFERENCES "site"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "community_permission" ADD CONSTRAINT "FK_b58dc6885cada3ecee6a7f1b54e" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "community_permission" ADD CONSTRAINT "FK_1e147a5a144a2dba0337ee291fd" FOREIGN KEY ("communityId") REFERENCES "community"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "community_permission" DROP CONSTRAINT "FK_1e147a5a144a2dba0337ee291fd"`
    );
    await queryRunner.query(
      `ALTER TABLE "community_permission" DROP CONSTRAINT "FK_b58dc6885cada3ecee6a7f1b54e"`
    );
    await queryRunner.query(
      `ALTER TABLE "site_permission" DROP CONSTRAINT "FK_a5b57b05f00c5701b782ea2e93f"`
    );
    await queryRunner.query(
      `ALTER TABLE "site_permission" DROP CONSTRAINT "FK_5ede40be71b1ee2adc0a929bebe"`
    );
    await queryRunner.query(
      `ALTER TABLE "organization_permission" DROP CONSTRAINT "FK_005aa04b3eb93b59b673ef77878"`
    );
    await queryRunner.query(
      `ALTER TABLE "organization_permission" DROP CONSTRAINT "FK_b1ffd0e0c9731e4dc1745214f26"`
    );
    await queryRunner.query(`DROP TABLE "community_permission"`);
    await queryRunner.query(`DROP TABLE "site_permission"`);
    await queryRunner.query(`DROP TABLE "organization_permission"`);
  }
}
