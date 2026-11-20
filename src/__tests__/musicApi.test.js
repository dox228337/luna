import { searchTracks } from '../services/musicApi';

const originalFetch = global.fetch;

beforeEach(() => {
  global.fetch = jest.fn();
});

afterEach(() => {
  global.fetch = originalFetch;
});

test('передає параметри пошуку та перетворює відповідь API на композиції', async () => {
  global.fetch.mockResolvedValue({
    ok: true,
    json: async () => ({
      results: [
        {
          trackId: 1,
          trackName: 'Обійми',
          artistName: 'Океан Ельзи',
          collectionName: 'Земля',
          trackTimeMillis: 225000,
          trackViewUrl: 'https://music.apple.com/ua/album/1',
        },
      ],
    }),
  });
  const controller = new AbortController();

  const result = await searchTracks(' Океан Ельзи ', controller.signal);
  const url = new URL(global.fetch.mock.calls[0][0]);

  expect(url.searchParams.get('term')).toBe('Океан Ельзи');
  expect(url.searchParams.get('entity')).toBe('song');
  expect(Number(url.searchParams.get('limit'))).toBeGreaterThanOrEqual(5);
  expect(global.fetch.mock.calls[0][1].signal).toBe(controller.signal);
  expect(result[0]).toMatchObject({ id: '1', title: 'Обійми', duration: 225000 });
});

test('відхиляє невдалий HTTP-статус сервера', async () => {
  global.fetch.mockResolvedValue({ ok: false, status: 500 });

  await expect(searchTracks('Музика')).rejects.toThrow('Помилка завантаження даних');
});

test('передає мережеву помилку компоненту', async () => {
  global.fetch.mockRejectedValue(new Error('Немає з’єднання'));

  await expect(searchTracks('Музика')).rejects.toThrow('Немає з’єднання');
});

test('відхиляє відповідь із некоректною структурою', async () => {
  global.fetch.mockResolvedValue({ ok: true, json: async () => ({ unexpected: [] }) });

  await expect(searchTracks('Музика')).rejects.toThrow('Помилка завантаження даних');
});

test('прибирає дублікати та неповні записи з відповіді', async () => {
  const item = { trackId: 1, trackName: 'Композиція', artistName: 'Виконавець' };
  global.fetch.mockResolvedValue({
    ok: true,
    json: async () => ({ results: [item, item, { trackId: 2 }] }),
  });

  const result = await searchTracks('Музика');

  expect(result).toHaveLength(1);
  expect(result[0]).toMatchObject({
    album: 'Невідомий альбом',
    duration: 0,
    artwork: '',
  });
});
