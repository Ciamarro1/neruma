#!/usr/bin/env bash
# ==============================================================================
# NERUMA BACKUP RESTORE & INTEGRITY VERIFICATION SCRIPT
# ==============================================================================

set -eo pipefail

if [ -z "$1" ] || [ -z "$2" ]; then
    echo "Uso: ./restore.sh <caminho_do_arquivo_sql_gz> <nome_do_banco>"
    echo "Exemplo: ./restore.sh /tmp/medusa_db_20260901.sql.gz medusa_db"
    exit 1
fi

BACKUP_FILE="$1"
TARGET_DB="$2"
PG_CONTAINER="${PG_CONTAINER:-neruma_postgres}"
PG_USER="${POSTGRES_ROOT_USER:-postgres}"

echo "=================================================="
echo "Iniciando Restauração do Banco: ${TARGET_DB}"
echo "Arquivo: ${BACKUP_FILE}"
echo "=================================================="

# 1. Validação do Checksum se existir
if [ -f "${BACKUP_FILE}.sha256" ]; then
    echo "Verificando integridade SHA256..."
    sha256sum -c "${BACKUP_FILE}.sha256"
    echo "✓ Checksum íntegro."
fi

# 2. Restauração
echo "Restaurando dados no container ${PG_CONTAINER}..."
gunzip -c "${BACKUP_FILE}" | docker exec -i "${PG_CONTAINER}" psql -U "${PG_USER}" -d "${TARGET_DB}"

echo "=================================================="
echo "✓ Restauração de ${TARGET_DB} concluída com sucesso!"
echo "=================================================="
