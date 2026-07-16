import type { DocChapter } from '../../data/docs/en';
import type { Locale } from '../config';

export async function loadDocs(locale: Locale): Promise<DocChapter[]> {
  const module = (await import(
    `../../data/docs/${locale}.ts`
  )) as { chapters: DocChapter[] };
  return module.chapters;
}
