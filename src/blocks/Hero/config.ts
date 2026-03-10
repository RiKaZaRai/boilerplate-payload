import type { Block } from 'payload';

import { linkField } from '@cms/fields/link';

export const Hero: Block = {
  slug: 'hero',
  interfaceName: 'HeroBlock',
  fields: [
    {
      name: 'type',
      type: 'select',
      defaultValue: 'highImpact',
      options: [
        { label: 'None', value: 'none' },
        { label: 'High Impact', value: 'highImpact' },
        { label: 'Medium Impact', value: 'mediumImpact' },
        { label: 'Low Impact', value: 'lowImpact' },
      ],
      required: true,
    },
    {
      name: 'richText',
      type: 'richText',
    },
    {
      name: 'links',
      type: 'array',
      fields: [linkField().fields as any].flat(),
      maxRows: 3,
    },
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
    },
  ],
};
