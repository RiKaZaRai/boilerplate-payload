import { getPayload } from 'payload';
import React from 'react';

import config from '@payload-config';

import { RenderBlocks } from '@cms/blocks/RenderBlocks';

export const dynamic = 'force-static';
export const revalidate = 600;

export default async function HomePage() {
  const payload = await getPayload({ config });

  const page = await payload.find({
    collection: 'pages',
    where: {
      slug: { equals: 'home' },
    },
    limit: 1,
  });

  const homePageData = page.docs[0];

  if (!homePageData) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16">
        <h1 className="text-4xl font-bold">Welcome</h1>
        <p className="mt-4 text-lg text-gray-600">
          Create a page with slug &quot;home&quot; in the admin panel to get started.
        </p>
        <a
          href="/admin"
          className="mt-6 inline-block rounded bg-black px-6 py-3 text-white hover:bg-gray-800"
        >
          Go to Admin Panel
        </a>
      </div>
    );
  }

  return (
    <div>
      {homePageData.hero && (
        <section className="mx-auto max-w-7xl px-4 py-16">
          <h1 className="text-4xl font-bold">{homePageData.title}</h1>
        </section>
      )}

      {homePageData.layout && (
        <RenderBlocks blocks={homePageData.layout as any} />
      )}
    </div>
  );
}
