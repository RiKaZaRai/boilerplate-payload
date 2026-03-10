import { searchPlugin } from '@payloadcms/plugin-search';

export const searchPluginConfig = searchPlugin({
  collections: ['posts'],
  searchOverrides: {
    fields: ({ defaultFields }) => [...defaultFields, { name: 'slug', type: 'text' }],
  },
});
