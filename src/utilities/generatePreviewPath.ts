import { getServerSideURL } from '@cms/utilities/getURL';

type CollectionSlug = 'pages' | 'posts';

const collectionPrefixMap: Record<CollectionSlug, string> = {
  pages: '',
  posts: '/posts',
};

export const generatePreviewPath = ({
  collection,
  slug,
}: {
  collection: CollectionSlug;
  slug: string;
}): string => {
  const serverURL = getServerSideURL();
  const path = `${collectionPrefixMap[collection]}/${slug}`;

  const params = {
    slug,
    collection,
    path,
  };

  const encodedParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    encodedParams.append(key, value);
  });

  return `${serverURL}/api/preview?${encodedParams.toString()}`;
};
