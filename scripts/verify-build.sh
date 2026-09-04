#!/usr/bin/env bash
# Construit le boilerplate contre une base PostgreSQL jetable. Le build Payload
# lit la base pendant generateStaticParams, même sur un clone sans données.

set -euo pipefail

command -v docker >/dev/null 2>&1 || {
  echo 'verify-build: Docker est requis pour le build de vérification.' >&2
  exit 2
}

container_name="payload-verify-postgres-${PPID:-0}-$$"
container_id=''

cleanup() {
  if [[ -n "$container_id" ]]; then
    docker rm --force "$container_id" >/dev/null 2>&1 || true
  fi
}
trap cleanup EXIT
trap 'exit 130' INT
trap 'exit 143' TERM

container_id="$(docker run --detach --rm \
  --name "$container_name" \
  --env POSTGRES_HOST_AUTH_METHOD=trust \
  --env POSTGRES_USER=postgres \
  --env POSTGRES_DB=cms_verify \
  --health-cmd 'pg_isready -U postgres -d cms_verify' \
  --health-interval 1s \
  --health-timeout 5s \
  --health-retries 30 \
  --publish 127.0.0.1::5432 \
  postgres:17-alpine)"

health='starting'
for _ in {1..30}; do
  health="$(docker inspect --format '{{.State.Health.Status}}' "$container_id" 2>/dev/null || true)"
  [[ "$health" == 'healthy' ]] && break
  [[ "$health" == 'unhealthy' ]] && break
  sleep 1
done

if [[ "$health" != 'healthy' ]]; then
  printf 'verify-build: PostgreSQL jetable non prêt (état : %s).\n' "${health:-introuvable}" >&2
  exit 1
fi

mapping="$(docker port "$container_id" 5432/tcp | head -n 1)"
host_port="${mapping##*:}"
[[ "$host_port" =~ ^[0-9]+$ ]] || {
  echo 'verify-build: port PostgreSQL publié introuvable.' >&2
  exit 1
}

export DATABASE_URL="postgresql://postgres@127.0.0.1:${host_port}/cms_verify"
export PAYLOAD_SECRET='quality-gate-only-not-for-runtime'

# Les migrations produites ne vivent que dans le snapshot de gate. Elles
# donnent à la base vierge le schéma requis par generateStaticParams.
pnpm payload migrate:create verify
pnpm payload migrate
pnpm build
