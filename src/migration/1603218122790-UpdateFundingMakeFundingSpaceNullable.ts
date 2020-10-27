import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateFundingMakeFundingSpaceNullable1603218122790
  implements MigrationInterface {
  name = 'UpdateFundingMakeFundingSpaceNullable1603218122790';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "funding" DROP CONSTRAINT "FK_49f8c856ef16b047c2f22016cd9"`
    );
    await queryRunner.query(
      `ALTER TABLE "funding" ALTER COLUMN "fundingSpaceId" int`
    );
    await queryRunner.query(
      `ALTER TABLE "funding" ADD CONSTRAINT "FK_49f8c856ef16b047c2f22016cd9" FOREIGN KEY ("fundingSpaceId") REFERENCES "funding_space"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "funding" DROP CONSTRAINT "FK_49f8c856ef16b047c2f22016cd9"`
    );
    await queryRunner.query(
      `ALTER TABLE "funding" ALTER COLUMN "fundingSpaceId" int NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "funding" ADD CONSTRAINT "FK_49f8c856ef16b047c2f22016cd9" FOREIGN KEY ("fundingSpaceId") REFERENCES "funding_space"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }
}
