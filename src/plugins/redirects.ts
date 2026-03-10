import { redirectsPlugin } from '@payloadcms/plugin-redirects';

import { revalidateRedirects } from '@cms/hooks/revalidateRedirects';

export const redirectsPluginConfig = redirectsPlugin({
  collections: ['pages', 'posts'],
  overrides: {
    hooks: {
      afterChange: [revalidateRedirects],
    },
  },
});
