import type { CollectionAfterChangeHook } from 'payload';

export const revalidateRedirects: CollectionAfterChangeHook = ({ doc, req: { payload } }) => {
  try {
    const { revalidateTag } = require('next/cache');
    payload.logger.info('Revalidating redirects');
    revalidateTag('redirects');
  } catch {
    // Outside of Next.js request context
  }
  return doc;
};
