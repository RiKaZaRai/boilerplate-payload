import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.{test,spec}.{ts,tsx}', 'tests/**/*.{test,spec}.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      // `include` est ce qui rend la mesure honnête : tout fichier qui matche est
      // compté, testé ou non. Sans lui, seuls les modules IMPORTÉS par un test
      // apparaissent — et ce dépôt n'ayant AUCUN test, la mesure serait vide au
      // lieu d'être à zéro. Une mesure vide se lit comme un succès.
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/payload-types.ts', // généré par `payload generate:types`
        'src/app/(payload)/**', // interface d'admin fournie par Payload
        '**/*.d.ts',
      ],
      // BASELINE — le ratchet de couverture, tenu à la main et VOLONTAIREMENT.
      //
      // Ce dépôt n'a aucun test : ces nombres SONT donc la totalité du code.
      // Ce n'est pas un renoncement — les seuils NÉGATIFS plafonnent le NOMBRE
      // d'éléments non couverts, donc même à zéro test, ajouter du code non testé
      // fait ROUGIR la gate. C'est précisément ce qu'on veut d'un boilerplate :
      // il part sans tests, il ne peut pas s'enfoncer.
      //
      // Quand des tests arrivent, BAISSER ces nombres dans le MÊME commit.
      // Jamais `thresholds.autoUpdate`, qui réécrit ce fichier pendant le run.
      thresholds: {
        statements: -272,
        branches: -133,
        functions: -61,
        lines: -259,
      },
    },
  },
});
