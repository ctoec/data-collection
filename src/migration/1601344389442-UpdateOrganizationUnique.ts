import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateOrganizationUnique1601344389442
  implements MigrationInterface {
  name = 'UpdateOrganizationUnique1601344389442';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "REL_b1ffd0e0c9731e4dc1745214f2" ON "organization_permission"`
    );
    await queryRunner.query(
      `ALTER TABLE "organization" ADD CONSTRAINT "UQ_providerName_parentOrganizationId" UNIQUE ("providerName", "parentOrganizationId")`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "organization" DROP CONSTRAINT "UQ_providerName_parentOrganizationId"`
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "REL_b1ffd0e0c9731e4dc1745214f2" ON "organization_permission" ("userId") WHERE ([userId] IS NOT NULL)`
    );
  }
}
