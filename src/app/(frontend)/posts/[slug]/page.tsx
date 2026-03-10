import type { Metadata } from 'next';

import { notFound } from 'next/navigation';
import { getPayload } from 'payload';
import React from 'react';

import config from '@payload-config';

type Args = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const payload = await getPayload({ config });

  const posts = await payload.find({
    collection: 'posts',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    select: {
      slug: true,
    },
  });

  return posts.docs
    .filter((doc) => doc.slug)
    .map(({ slug }) => ({
      slug,
    }));
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug } = await params;
  const payload = await getPayload({ config });

  const post = await payload.find({
    collection: 'posts',
    where: { slug: { equals: slug } },
    limit: 1,
  });

  const postData = post.docs[0];

  return {
    title: postData?.title ?? 'Post',
  };
}

export default async function PostPage({ params }: Args) {
  const { slug } = await params;
  const payload = await getPayload({ config });

  const result = await payload.find({
    collection: 'posts',
    where: { slug: { equals: slug } },
    limit: 1,
  });

  const postData = result.docs[0];

  if (!postData) {
    notFound();
  }

  return (
    <article className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-4xl font-bold">{postData.title}</h1>

      {postData.publishedAt && (
        <time className="mt-4 block text-sm text-gray-500">
          {new Date(postData.publishedAt).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </time>
      )}

      <div className="prose prose-lg mt-8 max-w-none">
        {/* Rich text content will be rendered here once RichText component is implemented */}
        <p className="text-gray-500">Content rendering requires a Lexical serializer component.</p>
      </div>
    </article>
  );
}
