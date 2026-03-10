import type { Plugin } from 'payload';

// --- ALWAYS INCLUDED PLUGINS ---
import { nestedDocsPluginConfig } from './nestedDocs';
import { redirectsPluginConfig } from './redirects';
import { seoPluginConfig } from './seo';

// --- OPTIONAL PLUGIN: search ---
import { searchPluginConfig } from './search';
// --- END OPTIONAL PLUGIN: search ---

// --- OPTIONAL PLUGIN: formBuilder ---
import { formBuilderPluginConfig } from './formBuilder';
// --- END OPTIONAL PLUGIN: formBuilder ---

// --- OPTIONAL PLUGIN: ecommerce ---
import { ecommercePluginConfig } from './ecommerce';
// --- END OPTIONAL PLUGIN: ecommerce ---

// --- OPTIONAL PLUGIN: multiTenant ---
import { multiTenantPluginConfig } from './multiTenant';
// --- END OPTIONAL PLUGIN: multiTenant ---

// --- OPTIONAL PLUGIN: importExport ---
import { importExportPluginConfig } from './importExport';
// --- END OPTIONAL PLUGIN: importExport ---

export const plugins: Plugin[] = [
  // Always included
  seoPluginConfig,
  redirectsPluginConfig,
  nestedDocsPluginConfig,

  // Optional - comment out or remove what you don't need
  searchPluginConfig,
  formBuilderPluginConfig,
  importExportPluginConfig,

  // Stubs - uncomment when configured (see individual plugin files)
  // ecommercePluginConfig,
  // multiTenantPluginConfig,
].filter(Boolean) as Plugin[];
