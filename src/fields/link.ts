import type { ArrayField, GroupField } from 'payload';

export type LinkType = 'internal' | 'external';

export const linkField = (overrides?: Record<string, unknown>): GroupField => ({
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
      required: true,
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
  ...overrides,
} as GroupField);

export const linksField = (overrides?: Record<string, unknown>): ArrayField => ({
  name: 'links',
  type: 'array',
  fields: [...linkField().fields],
  ...overrides,
} as ArrayField);
