import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  // Sans transformation du JSX, le provider de couverture échoue à parser les
  // fichiers `.tsx` JAMAIS importés par un test — or ce sont précisément ceux
  // qu'on veut compter pour 0. Il les excluait alors silencieusement de la
  // mesure : la couverture aurait menti par omission.
  plugins: [react()],
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
        // Parenthèses ÉCHAPPÉES : sans cela, picomatch les lit comme un groupe
        // d'extglob et le motif ne correspond à aucun répertoire réel — toutes
        // les routes d'admin restaient comptées malgré l'exclusion annoncée.
        'src/app/\\(payload\\)/**', // interface d'admin fournie par Payload
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
        statements: -326,
        branches: -163,
        functions: -77,
        lines: -312,
      },
    },
  },
});
