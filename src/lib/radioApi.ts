export interface RadioStation {
  id: number;
  name: string;
  url: string;
}

export async function fetchRadioStations(language: string): Promise<RadioStation[]> {
  const lang = language === 'ar' ? 'ar' : 'eng';
  const res = await fetch(`https://mp3quran.net/api/v3/radios?language=${lang}`);
  if (!res.ok) throw new Error('Failed to fetch radio stations');
  const data = await res.json();
  return data.radios ?? [];
}
