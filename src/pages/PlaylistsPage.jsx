import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMusic } from '../context/MusicContext';
import EmptyState from '../components/EmptyState';
import PlaylistForm from '../components/PlaylistForm';
import Icon from '../components/Icon';

export default function PlaylistsPage() {
  const { playlists, createPlaylist } = useMusic();
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  function handleCreate(values) {
    const id = createPlaylist(values);
    navigate(`/playlists/${id}`);
  }

  return (
    <>
      <section className="page-heading with-action">
        <div>
          <p className="eyebrow muted">ТВОЯ КОЛЕКЦІЯ НАСТРОЇВ</p>
          <h1>Мої плейлисти</h1>
          <p>Для ранкової кави, довгої дороги та всього між ними.</p>
        </div>
        <button
          className="button primary"
          type="button"
          onClick={() => setShowForm(true)}
        >
          <Icon name="plus" />
          Новий плейлист
        </button>
      </section>
      {showForm && (
        <PlaylistForm onSave={handleCreate} onCancel={() => setShowForm(false)} />
      )}
      {playlists.length > 0 ? (
        <div className="playlist-grid">
          {playlists.map((playlist, index) => {
            return (
              <Link
                className="playlist-card"
                to={`/playlists/${playlist.id}`}
                key={playlist.id}
              >
                <div className={`playlist-cover cover-${index % 4}`}>
                  <Icon name="music" />
                  <span>луна.</span>
                </div>
                <h2>{playlist.name}</h2>
                <p>{playlist.description || 'Твій особливий музичний настрій'}</p>
                <span className="playlist-count">
                  Композицій: {playlist.tracks.length}
                </span>
              </Link>
            );
          })}
        </div>
      ) : (
        !showForm && (
          <EmptyState title="Перший плейлист — перша історія" icon="playlist">
            <p>Створи добірку та додай до неї композиції з пошуку або обраного.</p>
          </EmptyState>
        )
      )}
    </>
  );
}
