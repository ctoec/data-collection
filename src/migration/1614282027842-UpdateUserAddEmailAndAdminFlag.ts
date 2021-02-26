import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateUserAddEmailAndAdminFlag1614282027842
  implements MigrationInterface {
  name = 'UpdateUserAddEmailAndAdminFlag1614282027842';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" ADD "email" nvarchar(255)`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD "isAdmin" bit NOT NULL CONSTRAINT "DF_b2033a3235871353c93700a0b60" DEFAULT 0`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "DF_b2033a3235871353c93700a0b60"`
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "isAdmin"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "email"`);
  }
}
