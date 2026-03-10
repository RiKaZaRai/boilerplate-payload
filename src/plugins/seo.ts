import { seoPlugin } from '@payloadcms/plugin-seo';

import { getServerSideURL } from '@cms/utilities/getURL';

export const seoPluginConfig = seoPlugin({
  collections: ['pages', 'posts'],
  uploadsCollection: 'media',
  generateTitle: ({ doc }) => `${(doc as any)?.title ?? ''} | My Site`,
  generateURL: ({ doc }) => {
    const url = getServerSideURL();
    const slug = (doc as any)?.slug ?? '';
    return `${url}/${slug}`;
  },
});
