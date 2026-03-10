import type { Field, FieldHook } from 'payload';

const formatSlug =
  (fallback: string): FieldHook =>
  ({ data, operation, originalDoc, value }) => {
    if (typeof value === 'string') {
      return slugify(value);
    }

    if (operation === 'create' || !data?.slug) {
      const fallbackData = data?.[fallback] || data?.[fallback];

      if (fallbackData && typeof fallbackData === 'string') {
        return slugify(fallbackData);
      }
    }

    return value;
  };

const slugify = (val: string): string =>
  val
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const slugField = (fieldToUse = 'title', overrides?: Partial<Field>): Field => ({
  name: 'slug',
  type: 'text',
  unique: true,
  index: true,
  admin: {
    position: 'sidebar',
    description: 'Auto-generated from title if left empty.',
  },
  hooks: {
    beforeValidate: [formatSlug(fieldToUse)],
  },
  ...overrides,
});
