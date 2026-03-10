import type { GlobalConfig } from 'payload';

import { linkField } from '@cms/fields/link';

export const Footer: GlobalConfig = {
  slug: 'footer',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'navItems',
      type: 'array',
      maxRows: 12,
      fields: [linkField()].map((f) => f) as any,
    },
  ],
};
