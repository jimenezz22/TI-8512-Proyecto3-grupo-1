import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Character } from '@/characters/entities/character.entity';
import { Movie } from '@/movies/entities/movie.entity';

export default registerAs(
  'database',
  (): TypeOrmModuleOptions => ({
    type: 'postgres',
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
    username: process.env.DATABASE_USERNAME || 'starwars_user',
    password: process.env.DATABASE_PASSWORD || 'starwars_password',
    database: process.env.DATABASE_NAME || 'starwars_db',
    entities: [Character, Movie],
    migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
    synchronize: process.env.TYPEORM_SYNCHRONIZE === 'true',
    logging: process.env.TYPEORM_LOGGING === 'true',
    dropSchema: process.env.TYPEORM_DROP_SCHEMA === 'true',
    autoLoadEntities: true,
    migrationsRun: process.env.NODE_ENV === 'production',
  }),
);