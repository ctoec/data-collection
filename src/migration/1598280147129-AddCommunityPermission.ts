import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCommunityPermission1598280147129 implements MigrationInterface {
  name = 'AddCommunityPermission1598280147129';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "permission" ADD "communityId" integer`
    );
    await queryRunner.query(
      `ALTER TYPE "public"."permission_type_enum" RENAME TO "permission_type_enum_old"`
    );
    await queryRunner.query(
      `CREATE TYPE "permission_type_enum" AS ENUM('0', '1', '2')`
    );
    await queryRunner.query(
      `ALTER TABLE "permission" ALTER COLUMN "type" TYPE "permission_type_enum" USING "type"::"text"::"permission_type_enum"`
    );
    await queryRunner.query(`DROP TYPE "permission_type_enum_old"`);
    await queryRunner.query(
      `ALTER TABLE "permission" ADD CONSTRAINT "FK_7318ea24953240430c1e915c683" FOREIGN KEY ("communityId") REFERENCES "community"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "permission" DROP CONSTRAINT "FK_7318ea24953240430c1e915c683"`
    );
    await queryRunner.query(
      `CREATE TYPE "permission_type_enum_old" AS ENUM('1', '2')`
    );
    await queryRunner.query(
      `ALTER TABLE "permission" ALTER COLUMN "type" TYPE "permission_type_enum_old" USING "type"::"text"::"permission_type_enum_old"`
    );
    await queryRunner.query(`DROP TYPE "permission_type_enum"`);
    await queryRunner.query(
      `ALTER TYPE "permission_type_enum_old" RENAME TO  "permission_type_enum"`
    );
    await queryRunner.query(
      `ALTER TABLE "permission" DROP COLUMN "communityId"`
    );
  }
}
