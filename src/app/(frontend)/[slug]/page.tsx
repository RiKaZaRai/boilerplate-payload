import type { Metadata } from 'next';

import { notFound } from 'next/navigation';
import { getPayload } from 'payload';
import React from 'react';

import config from '@payload-config';

import { RenderBlocks } from '@cms/blocks/RenderBlocks';

type Args = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const payload = await getPayload({ config });

  const pages = await payload.find({
    collection: 'pages',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    select: {
      slug: true,
    },
    where: {
      slug: { not_equals: 'home' },
    },
  });

  return pages.docs
    .filter((doc) => doc.slug)
    .map(({ slug }) => ({
      slug,
    }));
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug } = await params;
  const payload = await getPayload({ config });

  const page = await payload.find({
    collection: 'pages',
    where: { slug: { equals: slug } },
    limit: 1,
  });

  const pageData = page.docs[0];

  return {
    title: pageData?.title ?? 'Page',
  };
}

export default async function Page({ params }: Args) {
  const { slug } = await params;
  const payload = await getPayload({ config });

  const result = await payload.find({
    collection: 'pages',
    where: { slug: { equals: slug } },
    limit: 1,
  });

  const pageData = result.docs[0];

  if (!pageData) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-16">
      <h1 className="text-4xl font-bold">{pageData.title}</h1>

      {pageData.layout && <RenderBlocks blocks={pageData.layout as any} />}
    </div>
  );
}
