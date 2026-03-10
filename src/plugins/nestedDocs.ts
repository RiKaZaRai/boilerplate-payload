import { nestedDocsPlugin } from '@payloadcms/plugin-nested-docs';

export const nestedDocsPluginConfig = nestedDocsPlugin({
  collections: ['categories'],
  generateLabel: (_, doc) => (doc as any).title as string,
  generateURL: (docs) =>
    docs.reduce((url, doc) => `${url}/${(doc as any).slug}`, ''),
});
