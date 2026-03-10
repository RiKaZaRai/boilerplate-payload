import { searchPlugin } from '@payloadcms/plugin-search';

export const searchPluginConfig = searchPlugin({
  collections: ['posts'],
  searchOverrides: {
    fields: [
      {
        name: 'slug',
        type: 'text',
      },
    ],
  },
});
