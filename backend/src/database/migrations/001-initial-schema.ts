import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1718000000001 implements MigrationInterface {
  name = 'InitialSchema1718000000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create characters table
    await queryRunner.query(`
      CREATE TABLE "characters" (
        "id" SERIAL NOT NULL,
        "name" character varying(100) NOT NULL,
        "height" character varying(20),
        "mass" character varying(20),
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "deletedAt" TIMESTAMP,
        CONSTRAINT "PK_characters" PRIMARY KEY ("id")
      )
    `);

    // Create movies table
    await queryRunner.query(`
      CREATE TABLE "movies" (
        "id" SERIAL NOT NULL,
        "title" character varying(200) NOT NULL,
        "episode_id" integer,
        "director" character varying(100),
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "deletedAt" TIMESTAMP,
        CONSTRAINT "PK_movies" PRIMARY KEY ("id")
      )
    `);

    // Create junction table
    await queryRunner.query(`
      CREATE TABLE "character_movies" (
        "character_id" integer NOT NULL,
        "movie_id" integer NOT NULL,
        CONSTRAINT "PK_character_movies" PRIMARY KEY ("character_id", "movie_id")
      )
    `);

    // Create indexes
    await queryRunner.query(`
      CREATE UNIQUE INDEX "IDX_characters_name" ON "characters" ("name")
    `);

    await queryRunner.query(`
      CREATE UNIQUE INDEX "IDX_movies_title" ON "movies" ("title")
    `);

    await queryRunner.query(`
      CREATE UNIQUE INDEX "IDX_movies_episode_id" ON "movies" ("episode_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_character_movies_character_id" ON "character_movies" ("character_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_character_movies_movie_id" ON "character_movies" ("movie_id")
    `);

    // Add foreign key constraints
    await queryRunner.query(`
      ALTER TABLE "character_movies" 
      ADD CONSTRAINT "FK_character_movies_character" 
      FOREIGN KEY ("character_id") REFERENCES "characters"("id") 
      ON DELETE CASCADE ON UPDATE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "character_movies" 
      ADD CONSTRAINT "FK_character_movies_movie" 
      FOREIGN KEY ("movie_id") REFERENCES "movies"("id") 
      ON DELETE CASCADE ON UPDATE CASCADE
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "character_movies"`);
    await queryRunner.query(`DROP TABLE "movies"`);
    await queryRunner.query(`DROP TABLE "characters"`);
  }
}