import type { Field } from 'payload';

export type LinkType = 'internal' | 'external';

export const linkField = (overrides?: Partial<Field>): Field => ({
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
});

export const linksField = (overrides?: Partial<Field>): Field => ({
  name: 'links',
  type: 'array',
  fields: [linkField().fields as Field[]].flat(),
  ...overrides,
});
