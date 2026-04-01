import type { CollectionAfterChangeHook } from 'payload';

/**
 * Build the public-facing path for a document based on its collection.
 */
function buildPath(collectionSlug: string, docSlug: string): string {
  switch (collectionSlug) {
    case 'pages':
      return docSlug === 'home' ? '/' : `/${docSlug}`;
    case 'posts':
      return `/posts/${docSlug}`;
    default:
      return `/${docSlug}`;
  }
}

/**
 * Automatically creates a 302 redirect when a document is unpublished,
 * and removes it when the document is republished.
 *
 * The redirect points to the homepage ("/") by default.
 */
export const autoRedirectOnUnpublish: CollectionAfterChangeHook = async ({
  collection,
  doc,
  previousDoc,
  req: { payload },
}) => {
  const wasPublished = previousDoc?._status === 'published';
  const isPublished = doc._status === 'published';
  const collectionSlug = collection.slug;
  const fromPath = buildPath(collectionSlug, doc.slug);

  // Unpublished → create a temporary redirect to homepage
  if (wasPublished && !isPublished) {
    // Check if a redirect already exists for this path
    const existing = await payload.find({
      collection: 'redirects',
      where: { from: { equals: fromPath } },
      limit: 1,
    });

    if (existing.docs.length === 0) {
      await payload.create({
        collection: 'redirects',
        data: {
          from: fromPath,
          to: {
            type: 'custom',
            url: '/',
          },
          type: '302',
        } as Record<string, unknown>,
      });

      payload.logger.info(
        `Auto-redirect created: ${fromPath} → / (${collectionSlug} unpublished)`,
      );
    }
  }

  // Republished → remove the auto-created redirect
  if (!wasPublished && isPublished) {
    const existing = await payload.find({
      collection: 'redirects',
      where: { from: { equals: fromPath } },
      limit: 1,
    });

    if (existing.docs.length > 0) {
      await payload.delete({
        collection: 'redirects',
        id: existing.docs[0].id,
      });

      payload.logger.info(
        `Auto-redirect removed: ${fromPath} (${collectionSlug} republished)`,
      );
    }
  }

  return doc;
};
