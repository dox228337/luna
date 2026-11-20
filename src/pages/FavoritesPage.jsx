import { Link } from 'react-router-dom';
import { useMusic } from '../context/MusicContext';
import TrackList from '../components/TrackList';
import EmptyState from '../components/EmptyState';
import Icon from '../components/Icon';

export default function FavoritesPage() {
  const { favorites } = useMusic();

  return (
    <>
      <section className="page-heading">
        <span className="page-icon pink">
          <Icon name="heart" />
        </span>
        <div>
          <p className="eyebrow muted">ТЕ, ЩО ВІДГУКУЄТЬСЯ</p>
          <h1>Обране</h1>
          <p>Улюблені композиції завжди поруч. Збережено: {favorites.length}.</p>
        </div>
      </section>
      {favorites.length > 0 ? (
        <TrackList tracks={favorites} />
      ) : (
        <EmptyState title="Тут буде твоя улюблена музика" icon="heart">
          <p>Натисни на сердечко біля композиції, щоб зберегти її.</p>
          <Link className="button primary" to="/">
            Відкрити музику
          </Link>
        </EmptyState>
      )}
    </>
  );
}
