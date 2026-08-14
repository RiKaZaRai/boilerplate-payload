// @ts-check
import tseslint from 'typescript-eslint';
import nextPlugin from '@next/eslint-plugin-next';
import sonarjs from 'eslint-plugin-sonarjs';

// Plafond de taille de fichier. Au-delà, on découpe AVANT d'ajouter du code —
// un fichier long ne casse rien, il rend chaque évolution plus lente et chaque
// review plus bruyante. Blancs et commentaires COMPTÉS : un plafond qui les
// ignore se contourne en aérant le fichier.
const FILE_SIZE_LIMIT = 500;

// Complexité cognitive maximale par fonction (SonarSource). Mesure la difficulté
// de LECTURE, pas le nombre de chemins : imbriquer coûte plus cher qu'aligner.
const COGNITIVE_COMPLEXITY_LIMIT = 15;

export default tseslint.config(
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'public/**',
      // Généré par `payload generate:types` à chaque changement de collection.
      'src/payload-types.ts',
      // Généré par `payload generate:importmap`.
      'src/app/(payload)/admin/importMap.js',
    ],
  },
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx,js,jsx,mjs}'],
    plugins: { '@next/next': nextPlugin },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      // `warn`, PAS `error`, et c'est une décision datée.
      //
      // `pnpm lint` n'a jamais tourné sur ce dépôt : il appelait `next lint`,
      // supprimé dans Next 16, qui échouait en cherchant un répertoire nommé
      // « lint ». La dette révélée au premier vrai passage — 21 occurrences sur
      // 12 fichiers, surtout des `any` autour des types Payload — n'appartient
      // pas à ce lot, dont l'objet est de POSER les gates.
      //
      // Ces deux règles ne font pas partie des cinq verdicts structurels
      // (taille, complexité, cycles, code mort, couverture), eux en `error`.
      // À repasser en `error` une fois la dette soldée — c'est suivi à part.
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-require-imports': 'warn',
    },
  },
  // ── Qualité structurelle : taille et complexité ────────────────────────────
  // En `error` dès la naissance, sans fichier de dette : le dépôt est propre
  // (0 fichier > 500 lignes). Un ratchet ne se justifie que pour geler un
  // existant ; sur un ensemble vide, il n'ajoute qu'un fichier à maintenir.
  {
    files: ['**/*.{ts,tsx,js,jsx,mjs}'],
    plugins: { sonarjs },
    rules: {
      'max-lines': [
        'error',
        { max: FILE_SIZE_LIMIT, skipBlankLines: false, skipComments: false },
      ],
      'sonarjs/cognitive-complexity': ['error', COGNITIVE_COMPLEXITY_LIMIT],
      'sonarjs/no-identical-functions': 'error',
      'sonarjs/no-duplicated-branches': 'error',
      'sonarjs/no-collapsible-if': 'error',
    },
  },
  // Les tests échappent au plafond de taille, pas à la complexité : une suite de
  // cas est longue par nature (chaque cas se lit seul), alors qu'une fonction de
  // test illisible reste une fonction illisible.
  {
    files: ['**/*.{test,spec}.{ts,tsx}', '**/tests/**/*.{ts,tsx}'],
    rules: { 'max-lines': 'off' },
  },
  // Le seed est une séquence — créer les médias, puis les pages, puis les
  // articles —, pas une logique métier. Sa complexité est celle d'une recette.
  // Le plafond de taille, lui, s'y applique toujours.
  {
    files: ['src/seed/**/*.ts'],
    rules: { 'sonarjs/cognitive-complexity': 'off' },
  },
);
