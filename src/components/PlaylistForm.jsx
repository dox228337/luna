import { useState } from 'react';
import { useMusic } from '../context/MusicContext';
import { validatePlaylist } from '../utils/music';

export default function PlaylistForm({ playlist, onSave, onCancel }) {
  const { playlists } = useMusic();
  const [name, setName] = useState(playlist?.name || '');
  const [description, setDescription] = useState(playlist?.description || '');
  const [error, setError] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    const values = { name: name.trim(), description: description.trim() };
    const validationError = validatePlaylist(values, playlists, playlist?.id);

    if (validationError) {
      setError(validationError);
      return;
    }

    onSave(values);
  }

  return (
    <form
      className="playlist-form"
      onSubmit={handleSubmit}
      noValidate
      aria-label={playlist ? 'Редагування плейлиста' : 'Створення плейлиста'}
    >
      <h2>{playlist ? 'Редагувати плейлист' : 'Нова музична історія'}</h2>
      <label htmlFor="playlist-name">
        Назва плейлиста <span className="required-note">(обов’язково)</span>
      </label>
      <input
        id="playlist-name"
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder="Наприклад, Вечірнє місто"
        maxLength={60}
        aria-describedby={error ? 'playlist-error' : 'playlist-name-hint'}
      />
      <p className="field-hint" id="playlist-name-hint">
        Від 2 до 60 символів. Назва має бути унікальною.
      </p>
      <label htmlFor="playlist-description">Опис</label>
      <textarea
        id="playlist-description"
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        placeholder="Який настрій у цієї добірки?"
        maxLength={250}
        rows={3}
      />
      <p className="field-hint">{description.length} / 250</p>
      {error && (
        <p className="field-error" role="alert" id="playlist-error">
          {error}
        </p>
      )}
      <div className="form-actions">
        <button className="button primary" type="submit">
          {playlist ? 'Зберегти зміни' : 'Створити'}
        </button>
        <button className="button secondary" type="button" onClick={onCancel}>
          Скасувати
        </button>
      </div>
    </form>
  );
}
