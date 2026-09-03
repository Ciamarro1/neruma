import { MetadataRoute } from 'next';
import { getProducts } from '../lib/medusa/products.js';
import { getStories, getEditorialCollections } from '../lib/payload/client.js';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://neruma.com.br';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${siteUrl}`, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${siteUrl}/produtos`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${siteUrl}/colecoes`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${siteUrl}/lookbooks`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${siteUrl}/ambientes`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${siteUrl}/historias`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${siteUrl}/guias`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
  ];

  // Produtos do Medusa
  const products = await getProducts({ limit: 100 });
  const productRoutes: MetadataRoute.Sitemap = products.map((prod: any) => ({
    url: `${siteUrl}/produto/${prod.handle}`,
    lastModified: new Date(prod.updated_at || Date.now()),
    changeFrequency: 'daily',
    priority: 0.9,
  }));

  // Artigos do Payload CMS
  const stories = await getStories(50);
  const storyRoutes: MetadataRoute.Sitemap = stories.map((story: any) => ({
    url: `${siteUrl}/historias/${story.slug}`,
    lastModified: new Date(story.updatedAt || Date.now()),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  // Coleções do Payload CMS
  const collections = await getEditorialCollections();
  const collectionRoutes: MetadataRoute.Sitemap = collections.map((col: any) => ({
    url: `${siteUrl}/colecoes/${col.slug}`,
    lastModified: new Date(col.updatedAt || Date.now()),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [...staticRoutes, ...productRoutes, ...storyRoutes, ...collectionRoutes];
}
