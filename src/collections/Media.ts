import type { CollectionConfig } from 'payload';

import { anyone } from '@cms/access/anyone';
import { authenticated } from '@cms/access/authenticated';

export const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    staticDir: 'public/media',
    imageSizes: [
      {
        name: 'thumbnail',
        width: 300,
        height: undefined,
        position: 'centre',
      },
      {
        name: 'square',
        width: 500,
        height: 500,
        position: 'centre',
      },
      {
        name: 'small',
        width: 600,
        height: undefined,
        position: 'centre',
      },
      {
        name: 'medium',
        width: 900,
        height: undefined,
        position: 'centre',
      },
      {
        name: 'large',
        width: 1400,
        height: undefined,
        position: 'centre',
      },
      {
        name: 'xlarge',
        width: 1920,
        height: undefined,
        position: 'centre',
      },
      {
        name: 'og',
        width: 1200,
        height: 630,
        position: 'centre',
      },
    ],
    focalPoint: true,
    crop: true,
  },
  access: {
    read: anyone,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  folders: true,
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
    {
      name: 'caption',
      type: 'richText',
    },
  ],
};
