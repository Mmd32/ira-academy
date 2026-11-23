#!/usr/bin/env bash
# Publishes the current folder to the production server and restarts the site.
#   bash scripts/deploy.sh
set -euo pipefail
cd "$(dirname "$0")/.."

HOST=root@185.205.203.109
SSH="ssh -4 -i .deploy-key/id_ed25519 -o BatchMode=yes"

rsync -az -e "$SSH" --delete \
  --exclude node_modules --exclude .next --exclude data --exclude backups \
  --exclude .git --exclude .deploy-key --exclude out \
  ./ "$HOST":/srv/ira/current/

$SSH "$HOST" 'cd /srv/ira/current && set -a; . /srv/ira/shared/.env; set +a
  npm run build >/tmp/ira-build.log 2>&1 || { tail -25 /tmp/ira-build.log; exit 1; }
  chown -R ira:ira /srv/ira/current
  systemctl restart ira
  sleep 4
  echo "service: $(systemctl is-active ira)"
  for u in /admin/exams/ /admin/students/ /portal/; do
    printf "%s -> " "$u"
    curl -s -o /dev/null -w "%{http_code}\n" --resolve academyretailiran.com:443:127.0.0.1 -k "https://academyretailiran.com$u"
  done'
echo "تمام شد."
