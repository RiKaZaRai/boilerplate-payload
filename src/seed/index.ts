import 'dotenv/config';
import { getPayload } from 'payload';

import config from '@payload-config';

const seed = async () => {
  const payload = await getPayload({ config });

  payload.logger.info('--- Seeding database ---');

  // Create admin user
  const existingUsers = await payload.find({
    collection: 'users',
    where: { email: { equals: 'admin@example.com' } },
    limit: 1,
  });

  let adminUser;

  if (existingUsers.docs.length === 0) {
    adminUser = await payload.create({
      collection: 'users',
      data: {
        email: 'admin@example.com',
        password: 'admin123',
        role: 'admin',
        firstName: 'Admin',
        lastName: 'User',
      },
    });
    payload.logger.info('Created admin user: admin@example.com / admin123');
  } else {
    adminUser = existingUsers.docs[0];
    payload.logger.info('Admin user already exists, skipping.');
  }

  // Create sample categories
  const categories = ['Technology', 'Design', 'Business'];
  const createdCategories = [];

  for (const title of categories) {
    const existing = await payload.find({
      collection: 'categories',
      where: { title: { equals: title } },
      limit: 1,
    });

    if (existing.docs.length === 0) {
      const cat = await payload.create({
        collection: 'categories',
        data: { title },
      });
      createdCategories.push(cat);
      payload.logger.info(`Created category: ${title}`);
    } else {
      createdCategories.push(existing.docs[0]);
    }
  }

  // Create home page
  const existingHome = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'home' } },
    limit: 1,
  });

  if (existingHome.docs.length === 0) {
    await payload.create({
      collection: 'pages',
      data: {
        title: 'Home',
        slug: 'home',
        _status: 'published',
        hero: {
          type: 'highImpact',
        },
      },
    });
    payload.logger.info('Created home page');
  }

  // Create sample blog post
  const existingPost = await payload.find({
    collection: 'posts',
    where: { slug: { equals: 'hello-world' } },
    limit: 1,
  });

  if (existingPost.docs.length === 0) {
    await payload.create({
      collection: 'posts',
      data: {
        title: 'Hello World',
        slug: 'hello-world',
        _status: 'published',
        authors: [adminUser!.id],
        categories: createdCategories.length > 0 ? [createdCategories[0]!.id] : [],
        publishedAt: new Date().toISOString(),
      },
    });
    payload.logger.info('Created sample blog post: Hello World');
  }

  payload.logger.info('--- Seeding complete ---');
  payload.logger.info('');
  payload.logger.info('Admin credentials:');
  payload.logger.info('  Email: admin@example.com');
  payload.logger.info('  Password: admin123');
  payload.logger.info('');

  process.exit(0);
};

seed().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});
