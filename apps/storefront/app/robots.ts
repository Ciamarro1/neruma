import { MetadataRoute } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://neruma.com.br';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/checkout', '/carrinho', '/conta', '/api/'],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
