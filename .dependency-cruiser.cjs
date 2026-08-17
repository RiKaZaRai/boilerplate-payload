/**
 * Détection des cycles d'import — la 3e gate structurelle du projet.
 *
 * POURQUOI UN OUTIL SÉPARÉ
 *
 * Un cycle d'import ne se voit pas dans un fichier : il n'existe qu'entre
 * plusieurs. ESLint analyse fichier par fichier et ne peut donc pas le trouver
 * sans reconstruire le graphe complet — c'est exactement ce que fait
 * dependency-cruiser, et pourquoi il vaut sa dépendance.
 *
 * Ce que coûte un cycle, concrètement : un ordre d'initialisation qui dépend du
 * point d'entrée (donc un `undefined` en production que les tests ne voient
 * pas), un module impossible à extraire, et un tree-shaking qui abandonne.
 *
 * SE LANCE PAR WORKSPACE, JAMAIS DEPUIS LA RACINE
 *
 * `tsConfig.fileName` est résolu depuis le répertoire courant. Lancé à la racine,
 * l'outil prend le `tsconfig.json` racine — qui n'a AUCUN `paths` — et n'importe
 * quel alias (`@/lib/x`, `@saas/ui/y`) devient irrésolu. Le graphe est alors
 * amputé de la majorité des arêtes, et la gate rend un vert qui ne prouve rien.
 *
 * Mesuré ici le 2026-08-14 : lancé depuis la racine, `apps/web/src/lib/utils.ts`
 * est rapporté ORPHELIN alors que trois composants l'importent via `@/lib/utils`.
 * D'où `pnpm cycles` = `turbo run cycles`, une exécution par workspace, chacune
 * avec le `tsconfig.json` qui porte ses alias.
 *
 * PAS DE FICHIER DE DETTE ICI, VOLONTAIREMENT
 *
 * Le dépôt n'a aucun cycle aujourd'hui. Une baseline (`--output-type baseline`
 * puis `--ignore-known`) ne se justifie que pour geler un existant : sur un
 * ensemble vide, elle n'ajoute qu'un fichier à maintenir. Si un jour un cycle
 * doit être toléré temporairement, c'est ce mécanisme-là qu'il faut poser —
 * jamais un `severity: 'warn'`, qui rend la gate verte en la vidant de son sens.
 */
module.exports = {
  forbidden: [
    {
      name: 'no-circular',
      severity: 'error',
      comment:
        "Un cycle d'import rend l'ordre d'initialisation dépendant du point d'entrée. " +
        'Casser le cycle : extraire le type ou la constante partagée dans un module tiers.',
      from: {},
      to: { circular: true },
    },
  ],
  // Pas de règle `no-orphan-modules` : `knip` couvre déjà le code mort, et sur
  // Next.js elle est ininterprétable — `app/page.tsx` et `layout.tsx` ne sont
  // importés par personne, c'est le routage par convention de fichiers qui les
  // charge. Deux gates sur le même sujet, dont une qui crie à tort, c'est une
  // gate que l'on finit par désactiver.
  options: {
    // On ne suit pas dans node_modules : les cycles internes des dépendances ne
    // sont pas les nôtres, et les suivre multiplie le temps d'analyse par dix.
    doNotFollow: { path: 'node_modules' },
    // Le périmètre est le code SOURCE. Les artefacts de build (dist, .next,
    // .turbo) rejoueraient les mêmes cycles en double.
    exclude: { path: '(^|/)(node_modules|dist|\\.next|coverage)/' },
    tsConfig: { fileName: 'tsconfig.json' },
    tsPreCompilationDeps: true,
    enhancedResolveOptions: {
      exportsFields: ['exports'],
      conditionNames: ['import', 'require', 'node', 'default', 'types'],
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.mjs', '.cjs'],
    },
  },
};
