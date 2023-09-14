import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1694719639738 implements MigrationInterface {
    name = 'Default1694719639738'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`transactions\` CHANGE \`description\` \`description\` varchar(320) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`transactions\` CHANGE \`description\` \`description\` varchar(320) NOT NULL`);
    }

}
