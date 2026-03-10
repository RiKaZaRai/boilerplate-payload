import { postgresAdapter } from '@payloadcms/db-postgres';
import path from 'path';
import { buildConfig } from 'payload';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

import { Categories } from '@cms/collections/Categories';
import { Media } from '@cms/collections/Media';
import { Pages } from '@cms/collections/Pages';
import { Posts } from '@cms/collections/Posts';
import { Users } from '@cms/collections/Users';
import { defaultLexical } from '@cms/fields/defaultLexical';
import { Footer } from '@cms/globals/Footer/config';
import { Header } from '@cms/globals/Header/config';
import { SiteSettings } from '@cms/globals/SiteSettings/config';
import { plugins } from '@cms/plugins';
import { getServerSideURL } from '@cms/utilities/getURL';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    livePreview: {
      breakpoints: [
        { label: 'Mobile', name: 'mobile', width: 375, height: 667 },
        { label: 'Tablet', name: 'tablet', width: 768, height: 1024 },
        { label: 'Desktop', name: 'desktop', width: 1440, height: 900 },
      ],
    },
  },
  collections: [Pages, Posts, Media, Categories, Users],
  cors: [getServerSideURL()].filter(Boolean),
  globals: [Header, Footer, SiteSettings],
  editor: defaultLexical,
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  plugins,
  secret: process.env.PAYLOAD_SECRET || '',
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
});
