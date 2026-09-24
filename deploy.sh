#!/usr/bin/env bash
# Build and deploy wayfinding.support.
#
# The contact-form destination is private, so it is not committed. Set it in
# the environment or in an untracked .deploy.env file:
#
#   CONTACT_TO=someone@example.org
#
# This script writes a temporary wrangler config with the real destination,
# deploys with it, and deletes it. The committed wrangler.jsonc keeps a
# placeholder.
set -euo pipefail
cd "$(dirname "$0")"

if [ -f .deploy.env ]; then
  set -a
  # shellcheck disable=SC1091
  . ./.deploy.env
  set +a
fi

: "${CONTACT_TO:?Set CONTACT_TO to the contact-form destination (see deploy.sh)}"
case "$CONTACT_TO" in
  *@*.*) ;;
  *) echo "CONTACT_TO does not look like an email address" >&2; exit 1 ;;
esac

tmp="$(mktemp ./.wrangler-deploy.XXXXXX.jsonc)"
trap 'rm -f "$tmp"' EXIT
sed "s/contact-destination@example\.invalid/${CONTACT_TO//\//\\/}/g" wrangler.jsonc > "$tmp"

npx astro build
npx wrangler deploy --config "$tmp"
