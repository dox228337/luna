import { useState } from 'react';
import Icon from './Icon';

export default function SearchForm({ onSearch, initialQuery = '' }) {
  const [query, setQuery] = useState(initialQuery);
  const [error, setError] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    const value = query.trim();

    if (value.length < 2) {
      setError('Введіть щонайменше 2 символи для пошуку.');
      return;
    }

    setError('');
    onSearch(value);
  }

  return (
    <form className="search-form" onSubmit={handleSubmit} role="search">
      <label className="visually-hidden" htmlFor="music-search">
        Назва композиції або виконавець
      </label>
      <div className="search-input-wrap">
        <Icon name="search" />
        <input
          id="music-search"
          type="search"
          placeholder="Композиція, виконавець або альбом…"
          value={query}
          maxLength={100}
          onChange={(event) => setQuery(event.target.value)}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? 'search-error' : undefined}
        />
        <button className="button primary" type="submit">
          Знайти музику
        </button>
      </div>
      {error && (
        <p className="field-error" id="search-error" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
