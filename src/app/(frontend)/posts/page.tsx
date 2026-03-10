import type { Metadata } from 'next';

import { getPayload } from 'payload';
import React from 'react';

import config from '@payload-config';

export const dynamic = 'force-static';
export const revalidate = 600;

export const metadata: Metadata = {
  title: 'Blog',
};

export default async function PostsPage() {
  const payload = await getPayload({ config });

  const posts = await payload.find({
    collection: 'posts',
    draft: false,
    limit: 20,
    overrideAccess: false,
    sort: '-publishedAt',
    select: {
      title: true,
      slug: true,
      publishedAt: true,
      categories: true,
    },
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-16">
      <h1 className="text-4xl font-bold">Blog</h1>

      <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {posts.docs.map((post) => (
          <article key={post.id} className="rounded-lg border p-6">
            <h2 className="text-xl font-semibold">
              <a href={`/posts/${post.slug}`} className="hover:underline">
                {post.title}
              </a>
            </h2>
            {post.publishedAt && (
              <time className="mt-2 block text-sm text-gray-500">
                {new Date(post.publishedAt).toLocaleDateString('fr-FR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
            )}
          </article>
        ))}

        {posts.docs.length === 0 && (
          <p className="text-gray-500">No posts published yet.</p>
        )}
      </div>
    </div>
  );
}
