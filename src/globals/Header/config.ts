import type { GlobalConfig } from 'payload';

import { linkField } from '@cms/fields/link';

export const Header: GlobalConfig = {
  slug: 'header',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'navItems',
      type: 'array',
      maxRows: 8,
      fields: [linkField()].map((f) => f) as any,
    },
  ],
};
