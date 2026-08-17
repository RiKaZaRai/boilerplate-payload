import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload';

const safeRevalidate = async (path: string) => {
  try {
    const { revalidatePath, revalidateTag } = await import('next/cache');
    revalidatePath(path);
    // Next 16 impose un profil de durée de vie en second argument.
      // `{ expire: 0 }` reproduit exactement le comportement de l'appel
      // historique à un seul argument : expiration immédiate, donc le
      // prochain visiteur voit la version publiée. L'alternative `'max'`
      // servirait d'abord la version périmée (stale-while-revalidate), ce
      // qu'on ne veut pas juste après une publication.
      revalidateTag('posts-sitemap', { expire: 0 });
  } catch {
    // Outside of Next.js request context (e.g., seed script)
  }
};

export const revalidatePost: CollectionAfterChangeHook = ({
  doc,
  previousDoc,
  req: { payload },
}) => {
  if (doc._status === 'published') {
    const path = `/posts/${doc.slug}`;
    payload.logger.info(`Revalidating post at path: ${path}`);
    safeRevalidate(path);
  }

  if (previousDoc?._status === 'published' && doc._status !== 'published') {
    const oldPath = `/posts/${previousDoc.slug}`;
    payload.logger.info(`Revalidating old post at path: ${oldPath}`);
    safeRevalidate(oldPath);
  }

  return doc;
};

export const revalidatePostDelete: CollectionAfterDeleteHook = ({ doc, req: { payload } }) => {
  const path = `/posts/${doc.slug}`;
  payload.logger.info(`Revalidating deleted post at path: ${path}`);
  safeRevalidate(path);
  return doc;
};
