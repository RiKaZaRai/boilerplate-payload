import type { Block } from 'payload';

import { linkField } from '@cms/fields/link';

export const CallToAction: Block = {
  slug: 'callToAction',
  interfaceName: 'CallToActionBlock',
  fields: [
    {
      name: 'richText',
      type: 'richText',
    },
    {
      name: 'links',
      type: 'array',
      fields: [linkField().fields as any].flat(),
      maxRows: 2,
    },
  ],
};
