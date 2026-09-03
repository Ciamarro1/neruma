const payloadUrl =
  process.env.PAYLOAD_URL ||
  process.env.NEXT_PUBLIC_PAYLOAD_URL ||
  'http://localhost:3001';

interface FetchPayloadOptions {
  depth?: number;
  revalidate?: number;
  tags?: string[];
  params?: Record<string, string>;
}

export async function fetchPayload<T>(
  endpoint: string,
  options: FetchPayloadOptions = {}
): Promise<T | null> {
  const { depth = 2, revalidate = 300, tags = [], params = {} } = options;

  const url = new URL(`/api/${endpoint}`, payloadUrl);
  url.searchParams.set('depth', depth.toString());

  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });

  try {
    const response = await fetch(url.toString(), {
      next: {
        revalidate,
        tags: [endpoint, ...tags],
      },
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.warn(`[Payload] Erro HTTP ${response.status} ao consultar ${url.toString()}`);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error(`[Payload] Erro ao conectar em ${url.toString()}:`, error);
    return null;
  }
}

// ------------------------------------------------------------------------------
// Métodos Específicos com Tipagem
// ------------------------------------------------------------------------------

export async function getStories(limit = 10) {
  const data = await fetchPayload<{ docs: any[] }>('stories', {
    params: { limit: limit.toString() },
    tags: ['stories'],
  });
  return data?.docs || [];
}

export async function getStoryBySlug(slug: string) {
  const data = await fetchPayload<{ docs: any[] }>('stories', {
    params: { 'where[slug][equals]': slug },
    tags: [`story:${slug}`],
  });
  return data?.docs?.[0] || null;
}

export async function getLookbooks() {
  const data = await fetchPayload<{ docs: any[] }>('lookbooks', {
    tags: ['lookbooks'],
  });
  return data?.docs || [];
}

export async function getLookbookBySlug(slug: string) {
  const data = await fetchPayload<{ docs: any[] }>('lookbooks', {
    params: { 'where[slug][equals]': slug },
    tags: [`lookbook:${slug}`],
  });
  return data?.docs?.[0] || null;
}

export async function getEditorialCollections() {
  const data = await fetchPayload<{ docs: any[] }>('collections', {
    tags: ['collections'],
  });
  return data?.docs || [];
}

export async function getEditorialCollectionBySlug(slug: string) {
  const data = await fetchPayload<{ docs: any[] }>('collections', {
    params: { 'where[slug][equals]': slug },
    tags: [`collection:${slug}`],
  });
  return data?.docs?.[0] || null;
}

export async function getRooms() {
  const data = await fetchPayload<{ docs: any[] }>('rooms', {
    tags: ['rooms'],
  });
  return data?.docs || [];
}

export async function getGuides() {
  const data = await fetchPayload<{ docs: any[] }>('guides', {
    tags: ['guides'],
  });
  return data?.docs || [];
}

export async function getGlobal(slug: 'site-settings' | 'navigation' | 'seo') {
  return await fetchPayload<any>(`globals/${slug}`, {
    tags: [`global:${slug}`],
  });
}
