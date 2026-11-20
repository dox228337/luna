import { useEffect, useState } from 'react';
import { searchTracks } from '../services/musicApi';
import EmptyState from './EmptyState';
import Loading from './Loading';
import TrackList from './TrackList';

export default function ItemList({ query = 'Океан Ельзи' }) {
  const [result, setResult] = useState({ status: 'loading', tracks: [], query });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    let timedOut = false;

    setResult({ status: 'loading', tracks: [], query });

    // Таймер не залишає користувача в нескінченному очікуванні відповіді API.
    const timeout = setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, 15000);

    async function loadTracks() {
      try {
        const tracks = await searchTracks(query, controller.signal);

        if (active) {
          setResult({ status: 'success', tracks, query });
        }
      } catch {
        if (active && (!controller.signal.aborted || timedOut)) {
          setResult({ status: 'error', tracks: [], query });
        }
      } finally {
        clearTimeout(timeout);
      }
    }

    loadTracks();

    return () => {
      active = false;
      clearTimeout(timeout);
      controller.abort();
    };
  }, [query, attempt]);

  if (result.status === 'loading' || result.query !== query) {
    return <Loading />;
  }

  if (result.status === 'error') {
    return (
      <div className="request-error" role="alert">
        <h3>Помилка завантаження даних</h3>
        <p>Не вдалося отримати композиції. Перевірте з’єднання та спробуйте ще раз.</p>
        <button
          className="button secondary"
          type="button"
          onClick={() => setAttempt(attempt + 1)}
        >
          Спробувати ще раз
        </button>
      </div>
    );
  }

  if (result.tracks.length === 0) {
    return (
      <EmptyState title="Нічого не знайдено" icon="search">
        <p>Спробуйте іншу назву композиції або ім’я виконавця.</p>
      </EmptyState>
    );
  }

  return (
    <>
      <p className="result-count" role="status">
        Знайдено композицій: {result.tracks.length}
      </p>
      <TrackList tracks={result.tracks} />
    </>
  );
}
