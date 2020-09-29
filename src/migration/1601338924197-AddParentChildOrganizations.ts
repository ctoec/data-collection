import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddParentChildOrganizations1601338924197
  implements MigrationInterface {
  name = 'AddParentChildOrganizations1601338924197';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "organization" ADD "childUniqueIdType" varchar(10)`
    );
    await queryRunner.query(
      `ALTER TABLE "organization" ADD "parentOrganizationId" int`
    );
    await queryRunner.query(
      `ALTER TABLE "organization" ADD CONSTRAINT "FK_afbf6a8f88904c057bd1ec528e6" FOREIGN KEY ("parentOrganizationId") REFERENCES "organization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "organization" DROP CONSTRAINT "FK_afbf6a8f88904c057bd1ec528e6"`
    );
    await queryRunner.query(
      `ALTER TABLE "organization" DROP COLUMN "parentOrganizationId"`
    );
    await queryRunner.query(
      `ALTER TABLE "organization" DROP COLUMN "childUniqueIdType"`
    );
  }
}
