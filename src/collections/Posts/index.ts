import type { CollectionConfig } from 'payload';

import { authenticated } from '@cms/access/authenticated';
import { authenticatedOrPublished } from '@cms/access/authenticatedOrPublished';
import { Banner } from '@cms/blocks/Banner/config';
import { Code } from '@cms/blocks/Code/config';
import { MediaBlock } from '@cms/blocks/MediaBlock/config';
import { slugField } from '@cms/fields/slug';
import { populatePublishedAt } from '@cms/hooks/populatePublishedAt';

import { populateAuthors } from './hooks/populateAuthors';
import { revalidatePost, revalidatePostDelete } from './hooks/revalidatePost';

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'authors', 'publishedAt', 'updatedAt'],
    livePreview: {
      url: ({ data }) => {
        return `${process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000'}/posts/${data?.slug}`;
      },
    },
  },
  versions: {
    drafts: true,
  },
  access: {
    read: authenticatedOrPublished,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  hooks: {
    beforeChange: [populateAuthors],
    afterChange: [revalidatePost],
    afterDelete: [revalidatePostDelete],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'content',
      type: 'richText',
    },
    {
      name: 'relatedBlocks',
      type: 'blocks',
      blocks: [Banner, Code, MediaBlock],
    },
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'authors',
      type: 'relationship',
      relationTo: 'users',
      hasMany: true,
      admin: {
        position: 'sidebar',
      },
    },
    slugField('title'),
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
      hooks: {
        beforeChange: [populatePublishedAt],
      },
    },
  ],
};
