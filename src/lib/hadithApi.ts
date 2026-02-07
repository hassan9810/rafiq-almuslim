// Hadith API - Using fawazahmed0/hadith-api and api.hadith.gading.dev

const HADITH_API_BASE = 'https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1';
const GADING_API_BASE = 'https://api.hadith.gading.dev';

export interface HadithEdition {
  name: string;
  collection: string;
  language: string;
  hadiths: number;
}

export interface Hadith {
  hadithnumber: number;
  text: string;
  grades?: { name: string; grade: string }[];
  reference?: { book: number; hadith: number };
}

export interface HadithCollection {
  metadata: {
    name: string;
    section: string;
    sectionDetails: any[];
  };
  hadiths: Hadith[];
}

export interface HadithSection {
  hadithnumber: number;
  text: string;
  grades?: { name: string; grade: string }[];
}

// Main hadith collections
export const hadithCollections = [
  { id: 'bukhari', name: 'Sahih al-Bukhari', nameAr: 'صحيح البخاري', author: 'Imam Bukhari', hadiths: 7563 },
  { id: 'muslim', name: 'Sahih Muslim', nameAr: 'صحيح مسلم', author: 'Imam Muslim', hadiths: 7563 },
  { id: 'abudawud', name: 'Sunan Abu Dawud', nameAr: 'سنن أبي داود', author: 'Abu Dawud', hadiths: 5274 },
  { id: 'tirmidhi', name: 'Jami at-Tirmidhi', nameAr: 'جامع الترمذي', author: 'At-Tirmidhi', hadiths: 3956 },
  { id: 'nasai', name: "Sunan an-Nasa'i", nameAr: 'سنن النسائي', author: "An-Nasa'i", hadiths: 5761 },
  { id: 'ibnmajah', name: 'Sunan Ibn Majah', nameAr: 'سنن ابن ماجه', author: 'Ibn Majah', hadiths: 4341 },
  { id: 'malik', name: "Muwatta Malik", nameAr: 'موطأ مالك', author: 'Imam Malik', hadiths: 1858 },
  { id: 'ahmad', name: 'Musnad Ahmad', nameAr: 'مسند الإمام أحمد', author: 'Imam Ahmad ibn Hanbal', hadiths: 26363, maxApiIndex: 4305 },
];

// Fetch all editions
export async function fetchHadithEditions(): Promise<any> {
  try {
    const response = await fetch(`${HADITH_API_BASE}/editions.json`);
    if (!response.ok) throw new Error('Failed to fetch editions');
    return await response.json();
  } catch (error) {
    console.error('Error fetching hadith editions:', error);
    return null;
  }
}

// Fetch Musnad Ahmad hadith from Gading API using range (index-based)
// The API uses index 1-4305, each index maps to a hadith with its actual number
async function fetchMusnadAhmadHadith(index: number): Promise<Hadith | null> {
  try {
    // Use range endpoint with same start and end to get single hadith by index
    const response = await fetch(`${GADING_API_BASE}/books/ahmad?range=${index}-${index}`);
    if (!response.ok) return null;
    
    const data = await response.json();
    if (data.code !== 200 || !data.data?.hadiths?.length) return null;
    
    const hadith = data.data.hadiths[0];
    return {
      hadithnumber: hadith.number,
      text: hadith.arab, // Arabic text
    };
  } catch (error) {
    console.error('Error fetching Musnad Ahmad hadith:', error);
    return null;
  }
}

// Fetch a specific hadith
export async function fetchHadith(edition: string, hadithNumber: number): Promise<Hadith | null> {
  try {
    // Check if it's Musnad Ahmad - use Gading API
    if (edition.includes('ahmad') || edition.includes('ahmed')) {
      return await fetchMusnadAhmadHadith(hadithNumber);
    }
    
    const response = await fetch(`${HADITH_API_BASE}/editions/${edition}/${hadithNumber}.json`);
    if (!response.ok) throw new Error('Failed to fetch hadith');
    const data = await response.json();
    return data.hadiths?.[0] || data;
  } catch (error) {
    console.error('Error fetching hadith:', error);
    return null;
  }
}

// Search hadiths - currently returns null as API doesn't support direct search
// Users should use hadith number lookup instead
export async function searchHadiths(query: string, collection: string, language: string = 'ara'): Promise<Hadith[]> {
  // The API doesn't support text search - return empty for now
  // In production, you'd want to implement server-side search or use a different API
  console.log('Search not supported by this API. Use hadith number lookup instead.');
  return [];
}

// Fetch hadith collection info
export async function fetchCollectionInfo(): Promise<any> {
  try {
    const response = await fetch(`${HADITH_API_BASE}/info.json`);
    if (!response.ok) throw new Error('Failed to fetch info');
    return await response.json();
  } catch (error) {
    console.error('Error fetching collection info:', error);
    return null;
  }
}

// Fetch hadiths by section
export async function fetchHadithsBySection(edition: string, sectionNumber: number): Promise<HadithSection[]> {
  try {
    const response = await fetch(`${HADITH_API_BASE}/editions/${edition}/sections/${sectionNumber}.json`);
    if (!response.ok) throw new Error('Failed to fetch section');
    const data = await response.json();
    return data.hadiths || [];
  } catch (error) {
    console.error('Error fetching section:', error);
    return [];
  }
}

// Fetch random hadith (fetch a random number from collection)
export async function fetchRandomHadith(language: string = 'eng'): Promise<Hadith | null> {
  try {
    const collection = hadithCollections[Math.floor(Math.random() * hadithCollections.length)];
    const randomNumber = Math.floor(Math.random() * Math.min(collection.hadiths, 500)) + 1;
    const edition = `${language}-${collection.id}`;
    return await fetchHadith(edition, randomNumber);
  } catch (error) {
    console.error('Error fetching random hadith:', error);
    return null;
  }
}
