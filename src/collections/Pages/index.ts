import type { CollectionConfig } from 'payload';

import { authenticated } from '@cms/access/authenticated';
import { authenticatedOrPublished } from '@cms/access/authenticatedOrPublished';
import { Banner } from '@cms/blocks/Banner/config';
import { CallToAction } from '@cms/blocks/CallToAction/config';
import { Content } from '@cms/blocks/Content/config';
import { FormBlock } from '@cms/blocks/Form/config';
import { Hero } from '@cms/blocks/Hero/config';
import { MediaBlock } from '@cms/blocks/MediaBlock/config';
import { slugField } from '@cms/fields/slug';
import { populatePublishedAt } from '@cms/hooks/populatePublishedAt';

import { revalidatePage, revalidatePageDelete } from './hooks/revalidatePage';

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
    livePreview: {
      url: ({ data }) => {
        const path = data?.slug === 'home' ? '/' : `/${data?.slug}`;
        return `${process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000'}${path}`;
      },
    },
  },
  versions: {
    drafts: {
      autosave: { interval: 375 },
    },
  },
  access: {
    read: authenticatedOrPublished,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  hooks: {
    afterChange: [revalidatePage],
    afterDelete: [revalidatePageDelete],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'hero',
      type: 'group',
      fields: [
        {
          name: 'type',
          type: 'select',
          defaultValue: 'lowImpact',
          options: [
            { label: 'None', value: 'none' },
            { label: 'High Impact', value: 'highImpact' },
            { label: 'Medium Impact', value: 'mediumImpact' },
            { label: 'Low Impact', value: 'lowImpact' },
          ],
        },
        {
          name: 'richText',
          type: 'richText',
        },
        {
          name: 'links',
          type: 'array',
          fields: [
            {
              name: 'link',
              type: 'group',
              fields: [
                {
                  name: 'type',
                  type: 'select',
                  defaultValue: 'internal',
                  options: [
                    { label: 'Internal', value: 'internal' },
                    { label: 'External', value: 'external' },
                  ],
                },
                {
                  name: 'reference',
                  type: 'relationship',
                  relationTo: ['pages', 'posts'],
                  admin: {
                    condition: (_, siblingData) => siblingData?.type === 'internal',
                  },
                },
                {
                  name: 'url',
                  type: 'text',
                  admin: {
                    condition: (_, siblingData) => siblingData?.type === 'external',
                  },
                },
                {
                  name: 'label',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'newTab',
                  type: 'checkbox',
                  defaultValue: false,
                },
              ],
            },
          ],
          maxRows: 3,
        },
        {
          name: 'media',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
    {
      name: 'layout',
      type: 'blocks',
      blocks: [CallToAction, Content, MediaBlock, Banner, FormBlock],
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
    {
      name: 'seo',
      type: 'group',
      label: 'SEO',
      admin: {
        position: 'sidebar',
      },
      fields: [],
    },
  ],
};
