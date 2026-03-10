import type { CollectionConfig } from 'payload';

import { authenticated } from '@cms/access/authenticated';
import { checkRole } from '@cms/access/checkRole';

export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    tokenExpiration: 7200,
    maxLoginAttempts: 5,
    lockTime: 600000,
  },
  admin: {
    useAsTitle: 'email',
  },
  access: {
    create: authenticated,
    read: authenticated,
    update: ({ req: { user } }) => {
      if (checkRole(['admin'], user)) return true;
      return {
        id: {
          equals: user?.id,
        },
      };
    },
    delete: ({ req: { user } }) => checkRole(['admin'], user),
    admin: ({ req: { user } }) => checkRole(['admin', 'editor'], user),
  },
  fields: [
    {
      name: 'role',
      type: 'select',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
        { label: 'User', value: 'user' },
      ],
      defaultValue: 'user',
      required: true,
      access: {
        update: ({ req: { user } }) => checkRole(['admin'], user),
      },
    },
    {
      name: 'firstName',
      type: 'text',
    },
    {
      name: 'lastName',
      type: 'text',
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
    },
  ],
};
