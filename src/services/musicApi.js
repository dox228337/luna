const API_URL = 'https://itunes.apple.com/search';

export async function searchTracks(query, signal) {
  const parameters = new URLSearchParams({
    term: query.trim(),
    media: 'music',
    entity: 'song',
    country: 'ua',
    limit: '25',
  });

  const response = await fetch(`${API_URL}?${parameters}`, { signal });

  if (!response.ok) {
    throw new Error('Помилка завантаження даних');
  }

  const data = await response.json();

  if (!data || !Array.isArray(data.results)) {
    throw new Error('Помилка завантаження даних');
  }

  const tracks = new Map();

  for (const item of data.results) {
    if (
      !item ||
      !item.trackId ||
      typeof item.trackName !== 'string' ||
      typeof item.artistName !== 'string'
    ) {
      continue;
    }

    tracks.set(String(item.trackId), {
      id: String(item.trackId),
      title: item.trackName,
      artist: item.artistName,
      album:
        typeof item.collectionName === 'string'
          ? item.collectionName
          : 'Невідомий альбом',
      artwork: typeof item.artworkUrl100 === 'string' ? item.artworkUrl100 : '',
      duration: Number.isFinite(item.trackTimeMillis)
        ? Math.max(0, item.trackTimeMillis)
        : 0,
      url: typeof item.trackViewUrl === 'string' ? item.trackViewUrl : '',
    });
  }

  return Array.from(tracks.values());
}
