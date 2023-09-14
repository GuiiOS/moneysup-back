import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1694695814924 implements MigrationInterface {
    name = 'Default1694695814924'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`transactions\` (\`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(20) NOT NULL, \`description\` varchar(320) NOT NULL, \`value\` decimal(15,2) NOT NULL, \`date\` datetime NOT NULL, \`type\` enum ('revenue', 'expense') NOT NULL DEFAULT 'revenue', \`categorie\` enum ('wage', 'investment', 'gift', 'rent', 'bills', 'subscriptions', 'food', 'trip') NOT NULL DEFAULT 'wage', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`userId\` int NULL, INDEX \`IDX_d66471a99dd3836e1528d39a1e\` (\`date\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` int NOT NULL AUTO_INCREMENT, \`nickName\` varchar(20) NOT NULL, \`email\` varchar(320) NOT NULL, \`password\` varchar(72) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`transactions\` ADD CONSTRAINT \`FK_6bb58f2b6e30cb51a6504599f41\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`transactions\` DROP FOREIGN KEY \`FK_6bb58f2b6e30cb51a6504599f41\``);
        await queryRunner.query(`DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
        await queryRunner.query(`DROP INDEX \`IDX_d66471a99dd3836e1528d39a1e\` ON \`transactions\``);
        await queryRunner.query(`DROP TABLE \`transactions\``);
    }

}
