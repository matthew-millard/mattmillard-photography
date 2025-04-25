import { hashPassword } from '../app/utils';

export async function generateAdmin() {
  console.log('🌱 Generating a hashed password and creating id for admin...');

  const admin = {
    id: crypto.randomUUID(),
    email: 'contact@mattmillard.photography',
    password: await hashPassword('putYourPasswordHere...'), // Input admin password
    firstName: 'Matt',
    lastName: 'Millard',
  };

  console.log('admin', admin);

  console.log('Done.');
}

generateAdmin();
