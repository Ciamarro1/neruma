#!/usr/bin/env bash
# ==============================================================================
# NERUMA INFRASTRUCTURE HEALTHCHECK & DIAGNOSTIC SCRIPT
# ==============================================================================

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}======================================================${NC}"
echo -e "${BLUE}             NERUMA INFRASTRUCTURE HEALTH             ${NC}"
echo -e "${BLUE}======================================================${NC}"

check_service() {
    local name="$1"
    local container="$2"
    local test_cmd="$3"

    printf "%-25s" "${name}"
    
    if [ "$(docker ps -q -f name=^/${container}$)" ]; then
        if eval "${test_cmd}" > /dev/null 2>&1; then
            echo -e "${GREEN}[  OK  ] ✓${NC}"
        else
            echo -e "${YELLOW}[ WARN ] ! (Container rodando, teste falhou)${NC}"
        fi
    else
        echo -e "${RED}[ DOWN ] ✗ (Container parado ou inexistente)${NC}"
    fi
}

# 1. Edge & Proxy
check_service "Traefik Proxy" "neruma_traefik" "curl -sf http://localhost:8080/ping || true"

# 2. Data Layer
check_service "PostgreSQL 16" "neruma_postgres" "docker exec neruma_postgres pg_isready"
check_service "Valkey 7.2" "neruma_valkey" "docker exec neruma_valkey valkey-cli ping"
check_service "Typesense Search" "neruma_typesense" "curl -sf http://localhost:8108/health || true"
check_service "SeaweedFS Storage" "neruma_seaweedfs" "curl -sf http://localhost:8333 || true"

# 3. App Layer
check_service "Medusa v2 API" "neruma_medusa" "curl -sf http://localhost:9000/health || true"
check_service "Payload CMS 3.0" "neruma_payload" "curl -sf http://localhost:3001/api/access || true"
check_service "Next.js Storefront" "neruma_storefront" "curl -sf http://localhost:3000 || true"
check_service "AI Intel Worker" "neruma_ai_intel" "curl -sf http://localhost:8000/health || true"

# 4. Ops Layer
check_service "Uptime Kuma" "neruma_uptime" "curl -sf http://localhost:3001 || true"

echo -e "${BLUE}======================================================${NC}"
echo -e "Status de Redes Docker:"
docker network ls | grep neruma || echo "Nenhuma rede Neruma encontrada."
echo -e "${BLUE}======================================================${NC}"
