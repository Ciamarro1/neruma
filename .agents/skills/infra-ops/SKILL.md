---
name: infra-ops
description: Procedimentos operacionais para infraestrutura Docker, Traefik v3, PostgreSQL multi-database, Valkey, SeaweedFS e backups no Neruma (infra/).
---

# Infrastructure & DevOps Skill — Neruma

Esta habilidade orienta o gerenciamento de infraestrutura local e de produção da stack Neruma (`infra/`).

## 1. Responsabilidade
- Orquestração dos 10 containers da stack via Docker Compose (`docker-compose.yml` e `docker-compose.prod.yml`).
- Roteamento e terminação TLS via Traefik v3 com certificados Let's Encrypt / ACME.
- Gestão dos 4 bancos de dados isolados no PostgreSQL 16 (`medusa_db`, `payload_db`, `ai_db`, `listmonk_db`).
- Sincronização e backups atômicos diários para Cloudflare R2 com retenção progressiva (7d/4w/6m).
- Monitoramento de uptime e integridade com Uptime Kuma e script de healthcheck.

## 2. Comandos Frequentes
```bash
# Navegar até a pasta de infra
cd infra

# Subir os serviços básicos de infraestrutura local
docker compose up -d postgres valkey typesense minio traefik uptime-kuma

# Executar diagnóstico de saúde de todos os serviços
bash scripts/healthcheck.sh

# Ver logs de um container específico
docker compose logs -f traefik
docker compose logs -f medusa

# Executar backup do banco de dados para verificação
bash backup/backup-postgres.sh
```

## 3. Diretrizes de Segurança & Redes
- **Segregação de Redes:** Apenas o Traefik e portas públicas expostas devem se conectar à rede `neruma_public`. O PostgreSQL, Valkey e serviços internos residem na rede isolada `neruma_internal`.
- **Privilégio Mínimo:** Cada aplicação conecta-se ao Postgres com seu usuário dedicado (`medusa_user`, `payload_user`). Nunca utilize o usuário `postgres` ou `neruma_admin` nos apps em produção.
