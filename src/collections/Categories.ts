import type { CollectionConfig } from 'payload';

import { anyone } from '@cms/access/anyone';
import { authenticated } from '@cms/access/authenticated';
import { slugField } from '@cms/fields/slug';

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: anyone,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    slugField('title'),
  ],
};
