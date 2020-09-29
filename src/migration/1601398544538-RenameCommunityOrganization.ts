import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameCommunityOrganization1601398544538
  implements MigrationInterface {
  name = 'RenameCommunityOrganization1601398544538';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "provider" DROP CONSTRAINT "FK_28df50ee36fe137e27a42b83261"`
    );
    await queryRunner.query(
      `EXEC sp_rename "provider.communityId", "organizationId"`
    );
    await queryRunner.query(
      `CREATE TABLE "organization" ("id" int NOT NULL IDENTITY(1,1), "name" nvarchar(255) NOT NULL, CONSTRAINT "PK_472c1f99a32def1b0abb219cd67" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "organization_permission" ("id" int NOT NULL IDENTITY(1,1), "organizationId" int NOT NULL, "userId" int NOT NULL, CONSTRAINT "UQ_USER_ORGANIZATION" UNIQUE ("userId", "organizationId"), CONSTRAINT "PK_ff6561c44fcca6c8e16fe459157" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "provider" ADD CONSTRAINT "FK_16eea0a4b2f06afb58b46300222" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "organization_permission" ADD CONSTRAINT "FK_b1ffd0e0c9731e4dc1745214f26" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "organization_permission" ADD CONSTRAINT "FK_005aa04b3eb93b59b673ef77878" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "organization_permission" DROP CONSTRAINT "FK_005aa04b3eb93b59b673ef77878"`
    );
    await queryRunner.query(
      `ALTER TABLE "organization_permission" DROP CONSTRAINT "FK_b1ffd0e0c9731e4dc1745214f26"`
    );
    await queryRunner.query(
      `ALTER TABLE "provider" DROP CONSTRAINT "FK_16eea0a4b2f06afb58b46300222"`
    );
    await queryRunner.query(`DROP TABLE "organization_permission"`);
    await queryRunner.query(`DROP TABLE "organization"`);
    await queryRunner.query(
      `EXEC sp_rename "provider.organizationId", "communityId"`
    );
    await queryRunner.query(
      `ALTER TABLE "provider" ADD CONSTRAINT "FK_28df50ee36fe137e27a42b83261" FOREIGN KEY ("communityId") REFERENCES "community"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }
}
