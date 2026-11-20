import { Link, NavLink, Outlet } from 'react-router-dom';
import { useMusic } from '../context/MusicContext';
import Icon from './Icon';

export default function Layout() {
  const { favorites, playlists, storageError } = useMusic();

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        Перейти до вмісту
      </a>
      <aside className="sidebar">
        <Link className="brand" to="/" aria-label="Луна — головна">
          <span className="brand-symbol">
            <Icon name="music" />
          </span>
          луна<span className="brand-dot">.</span>
        </Link>
        <p className="nav-caption">ТВОЯ МУЗИКА</p>
        <nav className="main-navigation" aria-label="Основна навігація">
          <NavLink to="/" end>
            <Icon name="search" />
            Відкривай
          </NavLink>
          <NavLink to="/favorites">
            <Icon name="heart" />
            Обране<span className="nav-count">{favorites.length}</span>
          </NavLink>
          <NavLink to="/playlists">
            <Icon name="playlist" />
            Плейлисти<span className="nav-count">{playlists.length}</span>
          </NavLink>
        </nav>
        <div className="sidebar-library">
          <p className="nav-caption">МОЇ ПЛЕЙЛИСТИ</p>
          {playlists.length === 0 && (
            <p className="sidebar-hint">Твоя наступна добірка починається тут.</p>
          )}
          {playlists.map((playlist) => {
            return (
              <Link
                className="sidebar-playlist"
                to={`/playlists/${playlist.id}`}
                key={playlist.id}
              >
                <span className="small-cover">
                  <Icon name="music" />
                </span>
                <span>{playlist.name}</span>
              </Link>
            );
          })}
          <Link className="sidebar-create" to="/playlists">
            <Icon name="plus" />
            Створити плейлист
          </Link>
        </div>
        <div className="sidebar-note">
          <span className="note-decoration">♫</span>
          <strong>Твій настрій. Твій ритм.</strong>
          <p>Збирай музику, до якої хочеться повертатися.</p>
        </div>
      </aside>
      <div className="workspace">
        <header className="topbar">
          <span>Місце для твоєї музики</span>
          <span className="library-badge">
            <Icon name="music" />
            Особиста бібліотека
          </span>
        </header>
        <main id="main-content" tabIndex="-1">
          {storageError && (
            <p className="error-banner" role="alert">
              {storageError}
            </p>
          )}
          <Outlet />
        </main>
        <footer className="footer">
          <span>луна. Музика поруч.</span>
          <span>Каталог композицій — iTunes</span>
        </footer>
      </div>
    </div>
  );
}
