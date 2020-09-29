import { MigrationInterface, QueryRunner } from 'typeorm';

export class MakePermissionsDifferent1601342654357
  implements MigrationInterface {
  name = 'MakePermissionsDifferent1601342654357';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "organization" DROP CONSTRAINT "FK_cfb7e3bfaaf464bf80af3078126"`
    );
    await queryRunner.query(
      `ALTER TABLE "organization" DROP COLUMN "communityId"`
    );
    await queryRunner.query(
      `ALTER TABLE "organization" ALTER COLUMN "childUniqueIdType" varchar(10) NOT NULL`
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "REL_b1ffd0e0c9731e4dc1745214f2" ON "organization_permission" ("userId") WHERE "userId" IS NOT NULL`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "REL_b1ffd0e0c9731e4dc1745214f2" ON "organization_permission"`
    );
    await queryRunner.query(
      `ALTER TABLE "organization" ALTER COLUMN "childUniqueIdType" varchar(10)`
    );
    await queryRunner.query(`ALTER TABLE "organization" ADD "communityId" int`);
    await queryRunner.query(
      `ALTER TABLE "organization" ADD CONSTRAINT "FK_cfb7e3bfaaf464bf80af3078126" FOREIGN KEY ("communityId") REFERENCES "community"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }
}
