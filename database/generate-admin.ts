import { hashPassword } from '../app/utils';

// Run the script, grab the results from the console and create a seed.sql file to insert a new admin into the database

export async function generateAdmin() {
  console.log('🌱 Generating a hashed password and creating id for admin...');

  const admin = {
    id: crypto.randomUUID(),
    email: 'contact@mattmillard.photography',
    password: await hashPassword('putYourPasswordHere...'),
    firstName: 'Matt',
    lastName: 'Millard',
  };

  console.log('admin', admin);

  console.log('Done.');
}

generateAdmin();
