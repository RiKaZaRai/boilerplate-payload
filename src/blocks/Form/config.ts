import type { Block } from 'payload';

export const FormBlock: Block = {
  slug: 'formBlock',
  interfaceName: 'FormBlockType',
  fields: [
    {
      name: 'form',
      type: 'relationship',
      relationTo: 'forms',
      required: true,
    },
    {
      name: 'enableIntro',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'introContent',
      type: 'richText',
      admin: {
        condition: (_, siblingData) => siblingData?.enableIntro,
      },
    },
  ],
};
