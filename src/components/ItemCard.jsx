import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMusic } from '../context/MusicContext';
import { formatDuration } from '../utils/music';
import Icon from './Icon';

export default function ItemCard({ track, index, playlistId }) {
  const { favorites, playlists, toggleFavorite, addTrack, removeTrack } = useMusic();
  const [showPlaylists, setShowPlaylists] = useState(false);
  const [selectedId, setSelectedId] = useState('');
  const [message, setMessage] = useState('');
  const [imageFailed, setImageFailed] = useState(false);
  const isFavorite = favorites.some((item) => item.id === track.id);
  const availablePlaylists = playlists.filter((playlist) => {
    return !playlist.tracks.some((item) => item.id === track.id);
  });
  const targetId = availablePlaylists.some((playlist) => playlist.id === selectedId)
    ? selectedId
    : availablePlaylists[0]?.id || '';

  function handleAdd(event) {
    event.preventDefault();

    if (!targetId) {
      return;
    }

    addTrack(targetId, track);
    setMessage('Композицію додано до плейлиста.');
    setShowPlaylists(false);
  }

  return (
    <li className="track-item">
      <div className="track-row">
        <span className="track-number">{String(index + 1).padStart(2, '0')}</span>
        <div className="track-artwork">
          {track.artwork && !imageFailed ? (
            <img
              src={track.artwork}
              alt=""
              loading="lazy"
              onError={() => setImageFailed(true)}
            />
          ) : (
            <Icon name="music" />
          )}
        </div>
        <div className="track-info">
          <h3>{track.title}</h3>
          <p>{track.artist}</p>
        </div>
        <span className="track-album">{track.album}</span>
        <span className="track-duration">{formatDuration(track.duration)}</span>
        <div className="track-actions">
          <button
            className={`icon-button favorite-button ${isFavorite ? 'is-favorite' : ''}`}
            type="button"
            aria-label={`${isFavorite ? 'Видалити з обраного' : 'Додати до обраного'}: ${track.title}`}
            aria-pressed={isFavorite}
            onClick={() => toggleFavorite(track)}
          >
            <Icon name="heart" />
          </button>
          <button
            className="icon-button"
            type="button"
            aria-label={`Додати до плейлиста: ${track.title}`}
            aria-expanded={showPlaylists}
            onClick={() => {
              setShowPlaylists(!showPlaylists);
              setMessage('');
            }}
          >
            <Icon name="plus" />
          </button>
          {playlistId && (
            <button
              className="icon-button"
              type="button"
              aria-label={`Видалити з плейлиста: ${track.title}`}
              onClick={() => removeTrack(playlistId, track.id)}
            >
              <Icon name="close" />
            </button>
          )}
        </div>
      </div>
      {track.url && (
        <a className="track-source" href={track.url} target="_blank" rel="noreferrer">
          Слухати в iTunes
          <span className="visually-hidden">: {track.title} (нова вкладка)</span>
        </a>
      )}
      {showPlaylists && (
        <div className="track-playlist-panel">
          {availablePlaylists.length > 0 ? (
            <form onSubmit={handleAdd} className="add-track-form">
              <label htmlFor={`playlist-${track.id}`}>Плейлист</label>
              <select
                id={`playlist-${track.id}`}
                value={targetId}
                onChange={(event) => setSelectedId(event.target.value)}
              >
                {availablePlaylists.map((playlist) => {
                  return (
                    <option key={playlist.id} value={playlist.id}>
                      {playlist.name}
                    </option>
                  );
                })}
              </select>
              <button className="button primary small" type="submit">
                Додати
              </button>
            </form>
          ) : (
            <p>
              {playlists.length === 0
                ? 'Спочатку створіть плейлист. '
                : 'Композиція вже є в усіх плейлистах. '}
              <Link to="/playlists">Перейти до плейлистів</Link>
            </p>
          )}
        </div>
      )}
      {message && (
        <p className="track-message" role="status">
          {message}
        </p>
      )}
    </li>
  );
}
