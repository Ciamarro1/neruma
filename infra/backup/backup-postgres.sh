#!/usr/bin/env bash
# ==============================================================================
# NERUMA POSTGRESQL ATOMIC BACKUP SCRIPT (OFF-SITE TO CLOUDFLARE R2)
# ==============================================================================

set -eo pipefail

TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="/tmp/neruma_backups/postgres_${TIMESTAMP}"
mkdir -p "${BACKUP_DIR}"

# Variáveis do ambiente
PG_CONTAINER="${PG_CONTAINER:-neruma_postgres}"
PG_USER="${POSTGRES_ROOT_USER:-postgres}"
R2_BUCKET="${R2_BACKUP_BUCKET:-neruma-backups}"
R2_ENDPOINT="${R2_S3_ENDPOINT}"
AWS_ACCESS_KEY_ID="${R2_ACCESS_KEY_ID}"
AWS_SECRET_ACCESS_KEY="${R2_SECRET_ACCESS_KEY}"

echo "=================================================="
echo "Iniciando Backup do PostgreSQL: ${TIMESTAMP}"
echo "=================================================="

DATABASES=("medusa_db" "payload_db" "listmonk_db")

for DB in "${DATABASES[@]}"; do
    echo "Dumping database: ${DB}..."
    docker exec -t "${PG_CONTAINER}" pg_dump -U "${PG_USER}" -d "${DB}" --clean --if-exists --no-owner --no-privileges | gzip -9 > "${BACKUP_DIR}/${DB}_${TIMESTAMP}.sql.gz"
    
    # Gerar checksum para validação de integridade
    sha256sum "${BACKUP_DIR}/${DB}_${TIMESTAMP}.sql.gz" > "${BACKUP_DIR}/${DB}_${TIMESTAMP}.sql.gz.sha256"
    echo "✓ ${DB} dump concluído com sucesso."
done

# Criar manifesto do backup
cat <<EOF > "${BACKUP_DIR}/manifest.json"
{
  "timestamp": "${TIMESTAMP}",
  "type": "postgres_full",
  "databases": ["medusa_db", "payload_db", "listmonk_db"],
  "retention_policy": "7d_daily/4w_weekly/6m_monthly"
}
EOF

# Upload para Cloudflare R2 (utilizando AWS CLI com endpoint S3 compatível)
if [ -n "${R2_ACCESS_KEY_ID}" ] && [ -n "${R2_ENDPOINT}" ]; then
    echo "Enviando arquivos de backup para Cloudflare R2..."
    aws s3 sync "${BACKUP_DIR}" "s3://${R2_BUCKET}/postgres/daily/${TIMESTAMP}" \
        --endpoint-url "${R2_ENDPOINT}" \
        --no-progress

    echo "✓ Upload para Cloudflare R2 concluído com sucesso!"
else
    echo "⚠️ R2_ACCESS_KEY_ID ou R2_S3_ENDPOINT não definidos. Backup mantido em ${BACKUP_DIR}"
fi

echo "Backup finalizado com sucesso."
