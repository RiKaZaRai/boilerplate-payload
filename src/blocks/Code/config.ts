import type { Block } from 'payload';

export const Code: Block = {
  slug: 'code',
  interfaceName: 'CodeBlock',
  fields: [
    {
      name: 'language',
      type: 'select',
      options: [
        { label: 'TypeScript', value: 'typescript' },
        { label: 'JavaScript', value: 'javascript' },
        { label: 'HTML', value: 'html' },
        { label: 'CSS', value: 'css' },
        { label: 'JSON', value: 'json' },
        { label: 'Shell', value: 'shell' },
        { label: 'Python', value: 'python' },
        { label: 'SQL', value: 'sql' },
      ],
      defaultValue: 'typescript',
    },
    {
      name: 'code',
      type: 'code',
      required: true,
    },
  ],
};
