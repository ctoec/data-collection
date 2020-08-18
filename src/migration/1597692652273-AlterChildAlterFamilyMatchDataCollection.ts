import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterChildAlterFamilyMatchDataCollection1597692652273
  implements MigrationInterface {
  name = 'AlterChildAlterFamilyMatchDataCollection1597692652273';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "family" DROP COLUMN "addressLine1"`);
    await queryRunner.query(`ALTER TABLE "family" DROP COLUMN "addressLine2"`);
    await queryRunner.query(
      `ALTER TABLE "family" ADD "streetAddress" character varying`
    );
    await queryRunner.query(
      `ALTER TABLE "child" ADD "recievesSpecialEducationServices" boolean`
    );
    await queryRunner.query(
      `CREATE TYPE "child_specialeducationservicestype_enum" AS ENUM('LEA', 'Non LEA')`
    );
    await queryRunner.query(
      `ALTER TABLE "child" ADD "specialEducationServicesType" "child_specialeducationservicestype_enum"`
    );
    await queryRunner.query(
      `ALTER TYPE "public"."child_gender_enum" RENAME TO "child_gender_enum_old"`
    );
    await queryRunner.query(
      `CREATE TYPE "child_gender_enum" AS ENUM('Male', 'Female', 'Nonbinary', 'Unknown', 'Not Specified')`
    );
    await queryRunner.query(
      `ALTER TABLE "child" ALTER COLUMN "gender" TYPE "child_gender_enum" USING "gender"::"text"::"child_gender_enum"`
    );
    await queryRunner.query(`DROP TYPE "child_gender_enum_old"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "child_gender_enum_old" AS ENUM('Male', 'Female', 'Nonbinary', 'Unknown', 'Unspecified')`
    );
    await queryRunner.query(
      `ALTER TABLE "child" ALTER COLUMN "gender" TYPE "child_gender_enum_old" USING "gender"::"text"::"child_gender_enum_old"`
    );
    await queryRunner.query(`DROP TYPE "child_gender_enum"`);
    await queryRunner.query(
      `ALTER TYPE "child_gender_enum_old" RENAME TO  "child_gender_enum"`
    );
    await queryRunner.query(
      `ALTER TABLE "child" DROP COLUMN "specialEducationServicesType"`
    );
    await queryRunner.query(
      `DROP TYPE "child_specialeducationservicestype_enum"`
    );
    await queryRunner.query(
      `ALTER TABLE "child" DROP COLUMN "recievesSpecialEducationServices"`
    );
    await queryRunner.query(`ALTER TABLE "family" DROP COLUMN "streetAddress"`);
    await queryRunner.query(
      `ALTER TABLE "family" ADD "addressLine2" character varying`
    );
    await queryRunner.query(
      `ALTER TABLE "family" ADD "addressLine1" character varying`
    );
  }
}
