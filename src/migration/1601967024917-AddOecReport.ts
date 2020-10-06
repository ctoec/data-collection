import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddOecReport1601967024917 implements MigrationInterface {
  name = 'AddOecReport1601967024917';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "oec_report" ("id" int NOT NULL IDENTITY(1,1), "organizationId" int NOT NULL, "authorId" int, "updatedAt" datetime2 NOT NULL CONSTRAINT "DF_64d9eefb390b0b81de0c752f7c3" DEFAULT getdate(), CONSTRAINT "PK_dbdbbb1b56d550162e854d44b7d" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "oec_report" ADD CONSTRAINT "FK_8fa7c73d39ba24e9c3d873b8c8f" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "oec_report" ADD CONSTRAINT "FK_500a087d9ca7cc980ba0e4bd095" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "oec_report"`);
  }
}
