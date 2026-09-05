import { MetadataRoute } from 'next';
import { getProducts } from '../lib/medusa/products';
import { getStories, getEditorialCollections } from '../lib/payload/client';

function getSiteUrl(): string {
  let url = (process.env.NEXT_PUBLIC_SITE_URL || 'https://neruma.up.railway.app').trim();
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = `https://${url}`;
  }
  return url.replace(/\/+$/, '');
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${siteUrl}`, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${siteUrl}/produtos`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${siteUrl}/colecoes`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${siteUrl}/lookbooks`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${siteUrl}/ambientes`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${siteUrl}/historias`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${siteUrl}/guias`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
  ];

  let productRoutes: MetadataRoute.Sitemap = [];
  try {
    const products = await getProducts({ limit: 100 });
    productRoutes = (products || []).map((prod: any) => ({
      url: `${siteUrl}/produto/${prod.handle}`,
      lastModified: new Date(prod.updated_at || Date.now()),
      changeFrequency: 'daily',
      priority: 0.9,
    }));
  } catch {
    productRoutes = [];
  }

  let storyRoutes: MetadataRoute.Sitemap = [];
  try {
    const stories = await getStories(50);
    storyRoutes = (stories || []).map((story: any) => ({
      url: `${siteUrl}/historias/${story.slug}`,
      lastModified: new Date(story.updatedAt || Date.now()),
      changeFrequency: 'weekly',
      priority: 0.7,
    }));
  } catch {
    storyRoutes = [];
  }

  let collectionRoutes: MetadataRoute.Sitemap = [];
  try {
    const collections = await getEditorialCollections();
    collectionRoutes = (collections || []).map((col: any) => ({
      url: `${siteUrl}/colecoes/${col.slug}`,
      lastModified: new Date(col.updatedAt || Date.now()),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));
  } catch {
    collectionRoutes = [];
  }

  return [...staticRoutes, ...productRoutes, ...storyRoutes, ...collectionRoutes];
}
