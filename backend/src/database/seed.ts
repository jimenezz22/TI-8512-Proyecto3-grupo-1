import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';
import { DataSource } from 'typeorm';
import { seedStarWarsData } from './seeds/starwars-data.seed';

async function runSeed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);

  try {
    console.log('🌱 Starting seed process...');
    await seedStarWarsData(dataSource);
    console.log('✅ Seed completed successfully!');
  } catch (error) {
    console.error('❌ Seed failed:', error);
    throw error;
  } finally {
    await app.close();
  }
}

runSeed().catch((error) => {
  console.error('❌ Seed script failed:', error);
  process.exit(1);
});