#!/usr/bin/env bash
# Point d'entrée portable de la gate du projet.
# Délègue à la doctrine 4Runners lorsqu'elle est installée (file partagée et
# routage Studio), sinon exécute directement la commande dans le clone courant.

set -euo pipefail

DOCTRINE_ROOT="${AGENTS_DOCTRINE_ROOT:-${HOME:+$HOME/Dev/agents-doctrine}}"
DOCTRINE_GATE="${DOCTRINE_ROOT:+$DOCTRINE_ROOT/scripts/gate.sh}"

if [[ -z "$DOCTRINE_GATE" || ! -x "$DOCTRINE_GATE" ]]; then
  printf 'Doctrine introuvable : exécution locale sans file ni routage Studio. Définir AGENTS_DOCTRINE_ROOT ou installer agents-doctrine dans $HOME/Dev/agents-doctrine.\n' >&2
  exec "$@"
fi

exec "$DOCTRINE_GATE" "$@"
