#!/bin/sh
# Creates MinIO alias and bucket. Env vars come from compose `env_file: .env`.
set -e
i=0
until mc alias set local http://minio:9000 "${MINIO_ROOT_USER}" "${MINIO_ROOT_PASSWORD}" 2>/dev/null; do
  i=$((i + 1))
  if [ "$i" -gt 30 ]; then
    echo "MinIO not reachable"
    exit 1
  fi
  echo "waiting for MinIO..."
  sleep 2
done
mc mb -p "local/${MINIO_BUCKET}" || true
echo "MinIO ready"
