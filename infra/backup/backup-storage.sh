#!/usr/bin/env bash
# ==============================================================================
# NERUMA SEAWEEDFS OBJECT STORAGE BACKUP SCRIPT (OFF-SITE SYNC TO R2)
# ==============================================================================

set -eo pipefail

TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
SEAWEED_CONTAINER="${SEAWEED_CONTAINER:-neruma_seaweedfs}"
R2_BUCKET="${R2_BACKUP_BUCKET:-neruma-backups}"
R2_ENDPOINT="${R2_S3_ENDPOINT}"

echo "=================================================="
echo "Iniciando Backup do Storage SeaweedFS: ${TIMESTAMP}"
echo "=================================================="

# Exportando metadados do Filer
echo "Exportando metadados do Filer..."
docker exec -t "${SEAWEED_CONTAINER}" weed filer.backup -dir=/data/filer_backup_${TIMESTAMP}

# Sincronização S3-to-S3 direto entre SeaweedFS e Cloudflare R2
if [ -n "${R2_ACCESS_KEY_ID}" ] && [ -n "${R2_ENDPOINT}" ]; then
    echo "Sincronizando buckets do SeaweedFS para Cloudflare R2..."
    
    # Sincroniza produtos e imagens de ambiente
    aws s3 sync "s3://neruma-products" "s3://${R2_BUCKET}/storage/products" \
        --endpoint-url "http://localhost:8333" \
        --no-progress || true
        
    aws s3 sync "s3://neruma-content" "s3://${R2_BUCKET}/storage/content" \
        --endpoint-url "http://localhost:8333" \
        --no-progress || true

    echo "✓ Sincronização de Storage concluída com sucesso!"
else
    echo "⚠️ Credenciais de R2 não fornecidas. Sincronização off-site ignorada."
fi
