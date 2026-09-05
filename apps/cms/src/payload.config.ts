import { buildConfig } from 'payload';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { s3Storage } from '@payloadcms/storage-s3';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Importação das Coleções
import { Media } from './collections/Media.js';
import { Collections } from './collections/Collections.js';
import { Stories } from './collections/Stories.js';
import { Lookbooks } from './collections/Lookbooks.js';
import { Rooms } from './collections/Rooms.js';
import { Guides } from './collections/Guides.js';

// Importação dos Globals
import { SiteSettings } from './globals/SiteSettings.js';
import { Navigation } from './globals/Navigation.js';
import { SEO } from './globals/SEO.js';

dotenv.config();

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: 'users',
    meta: {
      titleSuffix: '— Neruma Editorial Studio',
    },
  },
  collections: [
    {
      slug: 'users',
      auth: true,
      labels: {
        singular: 'Editor / Usuário',
        plural: 'Equipe Editorial',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          label: 'Nome Completo',
          required: true,
        },
        {
          name: 'role',
          type: 'select',
          label: 'Função Editorial',
          options: [
            { label: 'Administrador Geral', value: 'admin' },
            { label: 'Editor Chefe', value: 'editor' },
            { label: 'Curador de Conteúdo / IA Reviewer', value: 'curator' },
          ],
          defaultValue: 'editor',
          required: true,
        },
      ],
    },
    Media,
    Collections,
    Stories,
    Lookbooks,
    Rooms,
    Guides,
  ],
  globals: [SiteSettings, Navigation, SEO],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || 'super_secret_payload_cms_key_32_chars_long',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString:
        process.env.DATABASE_URI ||
        process.env.DATABASE_URL ||
        'postgresql://payload_user:payload_db_secret_password_2026@postgres:5432/payload_db',
    },
    push: true,
  }),
  plugins: [
    s3Storage({
      collections: {
        media: {
          prefix: 'editorial',
        },
      },
      bucket: process.env.S3_BUCKET_CONTENT || 'neruma-content',
      config: {
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID || 'neruma_seaweed_admin_key',
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || 'neruma_seaweed_secret_key_prod_2026',
        },
        region: 'auto',
        endpoint: process.env.S3_ENDPOINT || 'http://seaweedfs:8333',
        forcePathStyle: true,
      },
    }),
  ],
});
