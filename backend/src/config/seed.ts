import { initDatabase } from './database';
import { createTables } from './schema';
import { UserModel } from '../models';
import dotenv from 'dotenv';

dotenv.config();

async function seed() {
  console.log('🌱 Starting database seed...');

  const db = await initDatabase();
  await createTables(db);

  const userModel = new UserModel(db);

  // Verificar se o admin já existe
  const existingAdmin = await userModel.findByUsername('Jones');

  if (existingAdmin) {
    console.log('⚠️  Admin user "Jones" already exists!');
    console.log('📧 Username:', existingAdmin.username);
    console.log('🔑 Master Password:', existingAdmin.master_password);
    return;
  }

  // Criar usuário admin
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const admin = await userModel.create('Jones', adminPassword, true);

  console.log('Admin user created successfully!');
  console.log('Username:', admin.username);
  console.log('Password:', adminPassword);
  console.log('Master Password (16 digits):', admin.master_password);
  console.log('Trust Score:', admin.trust_score);
  console.log('');
  console.log('IMPORTANT: Save the Master Password! It cannot be recovered.');
}

seed()
  .then(() => {
    console.log('Seed completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  });