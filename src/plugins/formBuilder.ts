import { formBuilderPlugin } from '@payloadcms/plugin-form-builder';

export const formBuilderPluginConfig = formBuilderPlugin({
  fields: {
    payment: false,
  },
});
