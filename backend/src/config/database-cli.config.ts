import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { Character } from '@/characters/entities/character.entity';
import { Movie } from '@/movies/entities/movie.entity';

config();

export default new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
  username: process.env.DATABASE_USERNAME || 'starwars_user',
  password: process.env.DATABASE_PASSWORD || 'starwars_password',
  database: process.env.DATABASE_NAME || 'starwars_db',
  entities: [Character, Movie],
  migrations: ['src/database/migrations/*{.ts,.js}'],
  synchronize: false,
  logging: true,
});