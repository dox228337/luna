import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useMusic } from '../context/MusicContext';
import { formatDuration } from '../utils/music';
import TrackList from '../components/TrackList';
import PlaylistForm from '../components/PlaylistForm';
import EmptyState from '../components/EmptyState';
import Icon from '../components/Icon';

export default function PlaylistPage() {
  const { playlistId } = useParams();
  const { playlists, updatePlaylist, deletePlaylist } = useMusic();
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const navigate = useNavigate();
  const playlist = playlists.find((item) => item.id === playlistId);

  if (!playlist) {
    return (
      <EmptyState title="Плейлист не знайдено">
        <p>Можливо, цю добірку вже видалено.</p>
        <Link className="button primary" to="/playlists">
          Мої плейлисти
        </Link>
      </EmptyState>
    );
  }

  const totalDuration = playlist.tracks.reduce(
    (total, track) => total + (track.duration || 0),
    0,
  );

  function handleSave(values) {
    updatePlaylist(playlistId, values);
    setEditing(false);
  }

  function handleDelete() {
    deletePlaylist(playlistId);
    navigate('/playlists');
  }

  return (
    <>
      <Link className="back-link" to="/playlists">
        Усі плейлисти
      </Link>
      <section className="page-heading playlist-detail-heading">
        <div className="detail-cover cover-0">
          <Icon name="music" />
        </div>
        <div>
          <p className="eyebrow muted">ТВІЙ ПЛЕЙЛИСТ</p>
          <h1>{playlist.name}</h1>
          <p>{playlist.description || 'Добірка під твій настрій.'}</p>
          <p className="playlist-meta">
            Композицій: {playlist.tracks.length} · Загальна тривалість:{' '}
            {formatDuration(totalDuration)}
          </p>
        </div>
      </section>
      <div className="playlist-toolbar">
        <Link className="button primary" to="/">
          Додати музику
        </Link>
        <button
          className="button secondary"
          type="button"
          onClick={() => setEditing(!editing)}
        >
          Редагувати
        </button>
        <button
          className="button text-danger"
          type="button"
          onClick={() => setConfirmDelete(true)}
        >
          Видалити плейлист
        </button>
      </div>
      {confirmDelete && (
        <div className="delete-confirmation" role="alert">
          <p>Видалити плейлист «{playlist.name}»? Відновити його буде неможливо.</p>
          <div className="form-actions">
            <button className="button danger" type="button" onClick={handleDelete}>
              Так, видалити
            </button>
            <button
              className="button secondary"
              type="button"
              onClick={() => setConfirmDelete(false)}
            >
              Скасувати видалення
            </button>
          </div>
        </div>
      )}
      {editing && (
        <PlaylistForm
          key={playlistId}
          playlist={playlist}
          onSave={handleSave}
          onCancel={() => setEditing(false)}
        />
      )}
      {playlist.tracks.length > 0 ? (
        <TrackList tracks={playlist.tracks} playlistId={playlistId} />
      ) : (
        <EmptyState title="Додай першу композицію" icon="playlist">
          <p>Знайди музику та натисни «+» біля композиції, щоб додати її сюди.</p>
        </EmptyState>
      )}
    </>
  );
}
