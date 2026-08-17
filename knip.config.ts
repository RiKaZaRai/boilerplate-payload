import type { KnipConfig } from 'knip';

/**
 * Gate de code mort — 4e verdict de la Definition of Done.
 *
 * CE QUI N'EST IMPORTÉ PAR PERSONNE, ET QUI N'EST POURTANT PAS MORT
 *
 * Deux frameworks chargent ici par convention, et knip ne le sait pas :
 *   - Next route par emplacement de fichier — `app/**\/page.tsx` n'est jamais
 *     importé.
 *   - Payload part de `payload.config.ts`, qui tire collections, globals, blocs,
 *     champs, hooks et plugins.
 * Sans ces points d'entrée, la gate rapporte tout le CMS comme mort.
 *
 * Un boilerplate offre en plus des utilitaires que personne n'utilise ENCORE :
 * les supprimer pour faire taire la gate reviendrait à appauvrir le kit. Ils
 * sont donc déclarés NOMMÉMENT ci-dessous, avec leur raison.
 */
const config: KnipConfig = {
  entry: [
    'src/payload.config.ts', // racine du CMS : tire collections, globals, blocs, plugins
    'src/app/**/{page,layout,route,template,error,loading,not-found}.{ts,tsx}',
    'src/middleware.ts',
    'src/seed/index.ts', // script, lancé par `pnpm db:seed`
    'next.config.mjs',
    'postcss.config.mjs',
    // Utilitaires offerts au développeur, à câbler dans le projet client.
    // `cn()` est la fonction attendue par tout composant shadcn/ui ajouté
    // ensuite ; `generatePreviewPath` sert dès qu'une collection active la
    // prévisualisation.
    'src/lib/utils.ts',
    'src/utilities/generatePreviewPath.ts',
    // Agrégat des blocs Lexical, offert pour être passé d'un coup à une
    // collection (`blocks: blocks`). Les collections livrées importent chaque
    // bloc individuellement, donc personne ne l'importe encore.
    'src/blocks/index.ts',
  ],
  // Les `.css` sont inclus : `src/app/globals.css` fait `@import "tailwindcss"`,
  // et sans eux knip déclare Tailwind inutilisé — un faux positif qui pousserait
  // à le désinstaller.
  project: ['src/**/*.{ts,tsx,css,scss}'],
  ignoreDependencies: [
    // Attendues par les composants shadcn/ui que le projet client ajoutera.
    // Les retirer obligerait à les réinstaller au premier composant copié.
    'class-variance-authority',
    'lucide-react',
    // Plugins OPTIONNELS du kit : importés dans `src/plugins/index.ts` mais
    // commentés dans le tableau exporté, car désactivés par défaut. Le
    // scaffolding les décommente à la demande — les désinstaller casserait
    // cette option.
    '@payloadcms/plugin-ecommerce',
    '@payloadcms/plugin-multi-tenant',
  ],
};

export default config;
