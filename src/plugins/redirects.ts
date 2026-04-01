import { redirectsPlugin } from '@payloadcms/plugin-redirects';

import { revalidateRedirects } from '@cms/hooks/revalidateRedirects';

export const redirectsPluginConfig = redirectsPlugin({
  collections: ['pages', 'posts'],
  redirectTypes: ['301', '302'],
  overrides: {
    hooks: {
      afterChange: [revalidateRedirects],
    },
  },
});
