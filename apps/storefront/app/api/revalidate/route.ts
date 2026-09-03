import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag, revalidatePath } from 'next/cache';

export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-revalidate-secret') || req.nextUrl.searchParams.get('secret');

  if (secret !== (process.env.REVALIDATE_SECRET || 'neruma_revalidate_secret_2026')) {
    return NextResponse.json({ message: 'Token de revalidação inválido.' }, { status: 401 });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const tag = body.tag || req.nextUrl.searchParams.get('tag');
    const path = body.path || req.nextUrl.searchParams.get('path');

    if (tag) {
      revalidateTag(tag);
      return NextResponse.json({ revalidated: true, tag, now: Date.now() });
    }

    if (path) {
      revalidatePath(path);
      return NextResponse.json({ revalidated: true, path, now: Date.now() });
    }

    // Revalidação global por padrão
    revalidatePath('/', 'layout');
    return NextResponse.json({ revalidated: true, scope: 'all', now: Date.now() });
  } catch (error) {
    return NextResponse.json({ message: 'Erro ao processar revalidação.', error }, { status: 500 });
  }
}
