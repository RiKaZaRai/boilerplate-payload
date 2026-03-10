import type { CollectionBeforeChangeHook } from 'payload';

export const populateAuthors: CollectionBeforeChangeHook = async ({
  data,
  req,
  operation,
}) => {
  if (operation === 'create' && req.user && !data.authors?.length) {
    return {
      ...data,
      authors: [req.user.id],
    };
  }

  return data;
};
