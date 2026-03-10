import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload';

const safeRevalidate = async (path: string) => {
  try {
    const { revalidatePath, revalidateTag } = await import('next/cache');
    revalidatePath(path);
    revalidateTag('pages-sitemap');
  } catch {
    // Outside of Next.js request context (e.g., seed script)
  }
};

export const revalidatePage: CollectionAfterChangeHook = ({
  doc,
  previousDoc,
  req: { payload },
}) => {
  if (doc._status === 'published') {
    const path = doc.slug === 'home' ? '/' : `/${doc.slug}`;
    payload.logger.info(`Revalidating page at path: ${path}`);
    safeRevalidate(path);
  }

  if (previousDoc?._status === 'published' && doc._status !== 'published') {
    const oldPath = previousDoc.slug === 'home' ? '/' : `/${previousDoc.slug}`;
    payload.logger.info(`Revalidating old page at path: ${oldPath}`);
    safeRevalidate(oldPath);
  }

  return doc;
};

export const revalidatePageDelete: CollectionAfterDeleteHook = ({ doc, req: { payload } }) => {
  const path = doc.slug === 'home' ? '/' : `/${doc.slug}`;
  payload.logger.info(`Revalidating deleted page at path: ${path}`);
  safeRevalidate(path);
  return doc;
};
