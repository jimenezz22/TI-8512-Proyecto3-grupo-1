import { DataSource } from 'typeorm';
import { Character } from '@/characters/entities/character.entity';
import { Movie } from '@/movies/entities/movie.entity';

export async function seedStarWarsData(dataSource: DataSource) {
  const characterRepository = dataSource.getRepository(Character);
  const movieRepository = dataSource.getRepository(Movie);

  // Check if data already exists
  const existingCharacters = await characterRepository.count();
  if (existingCharacters > 0) {
    console.log('Seed data already exists, skipping...');
    return;
  }

  // Create movies first
  const movies = await movieRepository.save([
    {
      title: 'A New Hope',
      episode_id: 4,
      director: 'George Lucas',
    },
    {
      title: 'The Empire Strikes Back',
      episode_id: 5,
      director: 'Irvin Kershner',
    },
    {
      title: 'Return of the Jedi',
      episode_id: 6,
      director: 'Richard Marquand',
    },
    {
      title: 'The Phantom Menace',
      episode_id: 1,
      director: 'George Lucas',
    },
    {
      title: 'Attack of the Clones',
      episode_id: 2,
      director: 'George Lucas',
    },
    {
      title: 'Revenge of the Sith',
      episode_id: 3,
      director: 'George Lucas',
    },
  ]);

  // Create characters with movie relationships
  const characters = await characterRepository.save([
    {
      name: 'Luke Skywalker',
      height: '172',
      mass: '77',
      movies: [movies[0], movies[1], movies[2]], // Episodes 4, 5, 6
    },
    {
      name: 'Darth Vader',
      height: '202',
      mass: '136',
      movies: [movies[0], movies[1], movies[2], movies[5]], // Episodes 4, 5, 6, 3
    },
    {
      name: 'Leia Organa',
      height: '150',
      mass: '49',
      movies: [movies[0], movies[1], movies[2]], // Episodes 4, 5, 6
    },
    {
      name: 'Obi-Wan Kenobi',
      height: '182',
      mass: '77',
      movies: [movies[0], movies[3], movies[4], movies[5]], // Episodes 4, 1, 2, 3
    },
    {
      name: 'Anakin Skywalker',
      height: '188',
      mass: '84',
      movies: [movies[3], movies[4], movies[5]], // Episodes 1, 2, 3
    },
    {
      name: 'Yoda',
      height: '66',
      mass: '17',
      movies: [movies[1], movies[2], movies[3], movies[4], movies[5]], // Episodes 5, 6, 1, 2, 3
    },
  ]);

  console.log(`✅ Seeded ${movies.length} movies and ${characters.length} characters`);
}