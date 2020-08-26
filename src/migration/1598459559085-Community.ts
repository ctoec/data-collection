import { MigrationInterface, QueryRunner } from 'typeorm';

export class Community1598459559085 implements MigrationInterface {
  name = 'Community1598459559085';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "organization" ADD CONSTRAINT "FK_cfb7e3bfaaf464bf80af3078126" FOREIGN KEY ("communityId") REFERENCES "community"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "organization" DROP CONSTRAINT "FK_cfb7e3bfaaf464bf80af3078126"`
    );
  }
}
