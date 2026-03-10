import { importExportPlugin } from '@payloadcms/plugin-import-export';

export const importExportPluginConfig = importExportPlugin({
  collections: [{ slug: 'pages' }, { slug: 'posts' }, { slug: 'categories' }],
});
