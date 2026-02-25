import { 
  search, 
  loadQuranData, 
  loadMorphology, 
  loadWordMap, 
  type QuranText, 
  type MorphologyAya, 
  type WordMap,
  type SearchResponse
} from 'quran-search-engine';

export interface QuranSearchContext {
  quranData: QuranText[];
  morphologyMap: Map<number, MorphologyAya>;
  wordMap: WordMap;
}

/**
 * Loads all necessary data for the quran-search-engine
 */
export async function initQuranSearch(): Promise<QuranSearchContext> {
  const [quranData, morphologyMap, wordMap] = await Promise.all([
    loadQuranData(),
    loadMorphology(),
    loadWordMap(),
  ]);

  return { quranData, morphologyMap, wordMap };
}

/**
 * Perform search using quran-search-engine
 */
export async function performAdvancedQuranSearch(
  query: string,
  context: QuranSearchContext,
  page: number = 1,
  limit: number = 50
): Promise<SearchResponse> {
  if (!query || query.trim().length < 2) {
    return {
      results: [],
      counts: { simple: 0, lemma: 0, root: 0, fuzzy: 0, total: 0 },
      pagination: { totalResults: 0, totalPages: 0, currentPage: page, limit }
    };
  }

  return search(
    query, 
    context.quranData, 
    context.morphologyMap, 
    context.wordMap, 
    { lemma: true, root: true }, 
    { page, limit }
  );
}

