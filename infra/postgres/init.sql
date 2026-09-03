-- ==============================================================================
-- NERUMA POSTGRESQL INITIALIZATION SCRIPT (LEAST PRIVILEGE / ISOLATED USERS)
-- ==============================================================================

-- 1. MEDUSA COMMERCE ENGINE DATABASE & USER
CREATE USER medusa_user WITH ENCRYPTED PASSWORD 'medusa_db_secret_password_2026';
CREATE DATABASE medusa_db OWNER medusa_user;
GRANT ALL PRIVILEGES ON DATABASE medusa_db TO medusa_user;

-- 2. PAYLOAD CMS 3.0 DATABASE & USER
CREATE USER payload_user WITH ENCRYPTED PASSWORD 'payload_db_secret_password_2026';
CREATE DATABASE payload_db OWNER payload_user;
GRANT ALL PRIVILEGES ON DATABASE payload_db TO payload_user;

-- 3. LISTMONK NEWSLETTER / MARKETING DATABASE & USER
CREATE USER listmonk_user WITH ENCRYPTED PASSWORD 'listmonk_db_secret_password_2026';
CREATE DATABASE listmonk_db OWNER listmonk_user;
GRANT ALL PRIVILEGES ON DATABASE listmonk_db TO listmonk_user;

-- 4. MATOMO ANALYTICS DATABASE & USER (PHASE 2)
CREATE USER matomo_user WITH ENCRYPTED PASSWORD 'matomo_db_secret_password_2026';
CREATE DATABASE matomo_db OWNER matomo_user;
GRANT ALL PRIVILEGES ON DATABASE matomo_db TO matomo_user;

-- Schema privileges & extensions
\c medusa_db
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
GRANT ALL ON SCHEMA public TO medusa_user;

\c payload_db
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
GRANT ALL ON SCHEMA public TO payload_user;

\c listmonk_db
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
GRANT ALL ON SCHEMA public TO listmonk_user;
